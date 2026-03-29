export interface RocketEngineAudioController {
    dispose(): void;
    setEnabled(enabled: boolean): void;
    setThrottle(throttle: number): void;
}

interface GraphNodes {
    airGain: GainNode;
    airHighPass: BiquadFilterNode;
    airLowPass: BiquadFilterNode;
    bandGainHigh: GainNode;
    bandGainLow: GainNode;
    bandGainMid: GainNode;
    bandPass: BiquadFilterNode;
    bodyShelf: BiquadFilterNode;
    brownGainA: GainNode;
    brownGainB: GainNode;
    bufferSourceA: AudioBufferSourceNode;
    bufferSourceAir: AudioBufferSourceNode;
    bufferSourceB: AudioBufferSourceNode;
    context: AudioContext;
    darkShelf: BiquadFilterNode;
    growlModDepth: GainNode;
    growlModOsc: OscillatorNode;
    growlPeak: BiquadFilterNode;
    highPass: BiquadFilterNode;
    lowModDepth: GainNode;
    lowModOsc: OscillatorNode;
    lowPass: BiquadFilterNode;
    master: GainNode;
    preSatGain: GainNode;
    saturation: WaveShaperNode;
    snarlModDepth: GainNode;
    snarlModOsc: OscillatorNode;
    snarlPeak: BiquadFilterNode;
}

const NOISE_DURATION_SEC = 11;
const LOOP_CROSSFADE_SAMPLES = 6144;

function smoothstep01(t: number): number {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
}

function normalizePeak(channelData: Float32Array, targetPeak: number): void {
    let peak = 0;
    for (const v of channelData) {
        peak = Math.max(peak, Math.abs(v));
    }
    const scale = peak > 1e-6 ? targetPeak / peak : 1;
    for (let i = 0; i < channelData.length; i++) {
        channelData[i] *= scale;
    }
}

function matchEndpoints(channelData: Float32Array): void {
    const n = channelData.length;
    if (n < 2) {
        return;
    }
    const d0 = channelData[0];
    const dLast = channelData[n - 1];
    const delta = dLast - d0;
    const inv = 1 / (n - 1);
    for (let i = 0; i < n; i++) {
        channelData[i] -= delta * i * inv;
    }
}

function crossfadeLoopSeam(channelData: Float32Array, overlap: number): void {
    const n = channelData.length;
    const L = Math.min(overlap, Math.floor(n / 3));
    if (L < 256) {
        return;
    }
    const head = new Float32Array(L);
    for (let k = 0; k < L; k++) {
        head[k] = channelData[k];
    }
    for (let k = 0; k < L; k++) {
        const w = smoothstep01(L > 1 ? k / (L - 1) : 0);
        const a = head[k];
        const b = channelData[n - L + k];
        channelData[k] = a * (1 - w) + b * w;
        channelData[n - L + k] = b * (1 - w) + a * w;
    }
}

function fillBrownNoiseBuffer(channelData: Float32Array): void {
    const leak = 0.9968;
    const step = 0.052;
    let brown = 0;
    for (let i = 0; i < channelData.length; i++) {
        const white = Math.random() * 2 - 1;
        brown = leak * brown + step * white;
        channelData[i] = brown;
    }
}

function fillWhiteNoiseBuffer(channelData: Float32Array): void {
    for (let i = 0; i < channelData.length; i++) {
        channelData[i] = Math.random() * 2 - 1;
    }
}

function prepareLoopingNoise(
    channelData: Float32Array,
    mode: "brown" | "white"
): void {
    if (mode === "brown") {
        fillBrownNoiseBuffer(channelData);
    } else {
        fillWhiteNoiseBuffer(channelData);
    }
    normalizePeak(channelData, 0.92);
    matchEndpoints(channelData);
    crossfadeLoopSeam(channelData, LOOP_CROSSFADE_SAMPLES);
    matchEndpoints(channelData);
}

function clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
}

function dropUnused(_reason: unknown): void {
    return;
}

function throttleToSonicPower(t: number): number {
    if (t <= 0) {
        return 0;
    }
    return clamp01(0.06 * t + 0.94 * t ** 0.29);
}

function easeTopForStability(sonic: number): number {
    if (sonic <= 0) {
        return 0;
    }
    return sonic * (1 - 0.072 * sonic * sonic);
}

function lerp(a: number, b: number, w: number): number {
    return a + (b - a) * w;
}

function createGrowlShaperCurve(sampleCount: number): Float32Array {
    const curve = new Float32Array(sampleCount);
    const last = Math.max(1, sampleCount - 1);
    for (let i = 0; i < sampleCount; i++) {
        const x = (i / last) * 2 - 1;
        const k = x >= 0 ? 2.95 : 3.5;
        let y = Math.tanh(k * x);
        y += 0.1 * x * x * x;
        y += x >= 0 ? 0.052 * x * x : -0.036 * x * x;
        curve[i] = Math.max(-1, Math.min(1, y));
    }
    return curve;
}

function buildGraph(context: AudioContext): GraphNodes {
    const frameCount = Math.floor(context.sampleRate * NOISE_DURATION_SEC);

    const bufferA = context.createBuffer(1, frameCount, context.sampleRate);
    prepareLoopingNoise(bufferA.getChannelData(0), "brown");

    const bufferB = context.createBuffer(1, frameCount, context.sampleRate);
    prepareLoopingNoise(bufferB.getChannelData(0), "brown");

    const bufferAir = context.createBuffer(1, frameCount, context.sampleRate);
    prepareLoopingNoise(bufferAir.getChannelData(0), "white");

    const bufferSourceA = context.createBufferSource();
    bufferSourceA.buffer = bufferA;
    bufferSourceA.loop = true;

    const bufferSourceB = context.createBufferSource();
    bufferSourceB.buffer = bufferB;
    bufferSourceB.loop = true;

    const bufferSourceAir = context.createBufferSource();
    bufferSourceAir.buffer = bufferAir;
    bufferSourceAir.loop = true;

    const brownGainA = context.createGain();
    brownGainA.gain.value = 0.5;
    const brownGainB = context.createGain();
    brownGainB.gain.value = 0.5;

    const lowPass = context.createBiquadFilter();
    lowPass.type = "lowpass";
    lowPass.Q.value = 1.05;

    const bandPass = context.createBiquadFilter();
    bandPass.type = "bandpass";
    bandPass.Q.value = 0.94;

    const highPass = context.createBiquadFilter();
    highPass.type = "bandpass";
    highPass.Q.value = 0.48;

    const bandGainLow = context.createGain();
    const bandGainMid = context.createGain();
    const bandGainHigh = context.createGain();

    const airHighPass = context.createBiquadFilter();
    airHighPass.type = "highpass";
    airHighPass.Q.value = 0.65;

    const airLowPass = context.createBiquadFilter();
    airLowPass.type = "lowpass";
    airLowPass.frequency.value = 14_000;
    airLowPass.Q.value = 0.55;

    const airGain = context.createGain();
    airGain.gain.value = 0;

    const master = context.createGain();
    master.gain.value = 0;

    const preSatGain = context.createGain();
    preSatGain.gain.value = 1;

    const saturation = context.createWaveShaper();
    saturation.curve = Float32Array.from(createGrowlShaperCurve(2049));
    saturation.oversample = "4x";

    const growlPeak = context.createBiquadFilter();
    growlPeak.type = "peaking";
    growlPeak.frequency.value = 215;
    growlPeak.Q.value = 4.95;
    growlPeak.gain.value = 0;

    const snarlPeak = context.createBiquadFilter();
    snarlPeak.type = "peaking";
    snarlPeak.frequency.value = 355;
    snarlPeak.Q.value = 4.05;
    snarlPeak.gain.value = 0;

    const growlModOsc = context.createOscillator();
    growlModOsc.type = "sine";
    growlModOsc.frequency.value = 2.13;
    const growlModDepth = context.createGain();
    growlModDepth.gain.value = 0;

    const snarlModOsc = context.createOscillator();
    snarlModOsc.type = "triangle";
    snarlModOsc.frequency.value = 0.37;
    const snarlModDepth = context.createGain();
    snarlModDepth.gain.value = 0;

    const lowModOsc = context.createOscillator();
    lowModOsc.type = "sine";
    lowModOsc.frequency.value = 0.19;
    const lowModDepth = context.createGain();
    lowModDepth.gain.value = 0;

    const bodyShelf = context.createBiquadFilter();
    bodyShelf.type = "lowshelf";
    bodyShelf.frequency.value = 95;
    bodyShelf.Q.value = Math.SQRT1_2;
    bodyShelf.gain.value = 0;

    const darkShelf = context.createBiquadFilter();
    darkShelf.type = "highshelf";
    darkShelf.frequency.value = 2200;
    darkShelf.Q.value = 0.55;
    darkShelf.gain.value = 0;

    bufferSourceA.connect(brownGainA);
    bufferSourceB.connect(brownGainB);

    brownGainA.connect(lowPass);
    brownGainA.connect(bandPass);
    brownGainA.connect(highPass);
    brownGainB.connect(lowPass);
    brownGainB.connect(bandPass);
    brownGainB.connect(highPass);

    bufferSourceAir.connect(airHighPass);
    airHighPass.connect(airLowPass);
    airLowPass.connect(airGain);

    lowPass.connect(bandGainLow);
    bandPass.connect(bandGainMid);
    highPass.connect(bandGainHigh);

    bandGainLow.connect(preSatGain);
    bandGainMid.connect(preSatGain);
    bandGainHigh.connect(preSatGain);
    airGain.connect(preSatGain);
    preSatGain.connect(saturation);
    saturation.connect(growlPeak);
    growlPeak.connect(snarlPeak);
    snarlPeak.connect(master);
    master.connect(bodyShelf);
    bodyShelf.connect(darkShelf);
    darkShelf.connect(context.destination);

    growlModOsc.connect(growlModDepth);
    growlModDepth.connect(growlPeak.frequency);
    snarlModOsc.connect(snarlModDepth);
    snarlModDepth.connect(snarlPeak.frequency);
    lowModOsc.connect(lowModDepth);
    lowModDepth.connect(lowPass.frequency);

    const t0 = context.currentTime;
    const loopDur = bufferA.duration;
    bufferSourceA.start(t0);
    bufferSourceB.start(t0 + loopDur * 0.5);
    bufferSourceAir.start(t0 + loopDur * 0.271);
    growlModOsc.start(t0);
    snarlModOsc.start(t0);
    lowModOsc.start(t0);

    return {
        airGain,
        airHighPass,
        airLowPass,
        bandGainHigh,
        bandGainLow,
        bandGainMid,
        bandPass,
        bodyShelf,
        brownGainA,
        brownGainB,
        bufferSourceA,
        bufferSourceAir,
        bufferSourceB,
        context,
        darkShelf,
        growlModDepth,
        growlModOsc,
        growlPeak,
        highPass,
        lowModDepth,
        lowModOsc,
        lowPass,
        master,
        preSatGain,
        saturation,
        snarlModDepth,
        snarlModOsc,
        snarlPeak,
    };
}

function clampAudioFrequency(ctx: BaseAudioContext, hz: number): number {
    const maxHz = ctx.sampleRate * 0.49;
    return Math.min(maxHz, Math.max(20, hz));
}

function rampParam(
    ctx: BaseAudioContext,
    param: AudioParam,
    target: number,
    durationSec: number
): void {
    const t = ctx.currentTime;
    const v = param.value;
    param.cancelScheduledValues(t);
    param.setValueAtTime(v, t);
    param.linearRampToValueAtTime(target, t + durationSec);
}

function applyThrottleToGraph(nodes: GraphNodes, throttleUi: number): void {
    const ctx = nodes.context;
    const tUi = clamp01(throttleUi);
    const sonic = throttleToSonicPower(tUi);
    const s = easeTopForStability(sonic);

    const open = lerp(s, sonic, 0.22);

    const lowHz = clampAudioFrequency(ctx, 38 + open * 72);
    const midHz = clampAudioFrequency(ctx, 68 + open * 122);
    const highHz = clampAudioFrequency(ctx, 148 + open * 202);

    const dFilter = 0.1;
    const dGain = 0.075;
    const dShelf = 0.11;
    const dDrive = 0.065;
    const dPeak = 0.085;

    rampParam(ctx, nodes.lowPass.frequency, lowHz, dFilter);
    rampParam(ctx, nodes.bandPass.frequency, midHz, dFilter);
    rampParam(ctx, nodes.highPass.frequency, highHz, dFilter);

    const presence = 0.11 + 0.89 * s;
    const gLow = (0.54 + open * 0.56) * presence * 0.58;
    const gMid = (0.42 + open * 0.62) * presence * 0.48;
    const gHigh = (0.1 + open * 0.22) * presence * 0.14;

    rampParam(ctx, nodes.bandGainLow.gain, gLow, dGain);
    rampParam(ctx, nodes.bandGainMid.gain, gMid, dGain);
    rampParam(ctx, nodes.bandGainHigh.gain, gHigh, dGain);

    const drive = Math.min(1.48, 1.02 + s * 0.46);
    rampParam(ctx, nodes.preSatGain.gain, drive, dDrive);

    rampParam(
        ctx,
        nodes.growlPeak.frequency,
        clampAudioFrequency(ctx, 150 + open * 126),
        dPeak
    );
    rampParam(ctx, nodes.growlPeak.gain, Math.min(16.5, 7.2 + s * 15.2), dPeak);

    rampParam(
        ctx,
        nodes.snarlPeak.frequency,
        clampAudioFrequency(ctx, 252 + open * 188),
        dPeak
    );
    rampParam(ctx, nodes.snarlPeak.gain, Math.min(14.2, 5.8 + s * 13.4), dPeak);

    const masterLevel = Math.min(0.27, s * (0.168 + 0.118 * s));
    rampParam(ctx, nodes.master.gain, masterLevel, dGain);

    rampParam(
        ctx,
        nodes.bodyShelf.frequency,
        clampAudioFrequency(ctx, 70 + open * 50),
        dShelf
    );
    rampParam(ctx, nodes.bodyShelf.gain, 5.4 + s * 11.4, dShelf);

    rampParam(
        ctx,
        nodes.darkShelf.frequency,
        clampAudioFrequency(ctx, 1480 + open * 970),
        dShelf
    );
    rampParam(ctx, nodes.darkShelf.gain, -1.35 - s * 7.85, dShelf);

    const airMixFromUi = smoothstep01((tUi - 0.08) / 0.52);
    const airMixFromSonic = smoothstep01((sonic - 0.18) / 0.48);
    const airMix = clamp01(Math.max(airMixFromUi, airMixFromSonic));
    const airLevel =
        airMix * presence * (0.005 + tUi * 0.034) * (0.48 + 0.22 * sonic);
    const dAir = 0.034;
    rampParam(ctx, nodes.airGain.gain, airLevel, dAir);
    rampParam(
        ctx,
        nodes.airHighPass.frequency,
        clampAudioFrequency(ctx, 1400 + open * 8200),
        dAir
    );
    rampParam(
        ctx,
        nodes.airLowPass.frequency,
        clampAudioFrequency(ctx, 9000 + open * 6500),
        dAir
    );

    const mod = 0.1 + 0.9 * s;
    const dMod = 0.085;
    rampParam(ctx, nodes.lowModDepth.gain, mod * 12, dMod);
    rampParam(ctx, nodes.growlModDepth.gain, mod * 23, dMod);
    rampParam(ctx, nodes.snarlModDepth.gain, mod * 33, dMod);
}

function silenceGraph(nodes: GraphNodes): void {
    const ctx = nodes.context;
    const d = 0.07;
    rampParam(ctx, nodes.master.gain, 0, d);
    rampParam(ctx, nodes.bandGainLow.gain, 0, d);
    rampParam(ctx, nodes.bandGainMid.gain, 0, d);
    rampParam(ctx, nodes.bandGainHigh.gain, 0, d);
    rampParam(ctx, nodes.preSatGain.gain, 1, d);
    rampParam(ctx, nodes.growlPeak.gain, 0, d);
    rampParam(ctx, nodes.snarlPeak.gain, 0, d);
    rampParam(ctx, nodes.bodyShelf.gain, 0, d);
    rampParam(ctx, nodes.darkShelf.gain, 0, d);
    rampParam(ctx, nodes.airGain.gain, 0, d);
    rampParam(ctx, nodes.lowModDepth.gain, 0, d);
    rampParam(ctx, nodes.growlModDepth.gain, 0, d);
    rampParam(ctx, nodes.snarlModDepth.gain, 0, d);
}

function teardownGraph(nodes: GraphNodes): void {
    for (const src of [
        nodes.bufferSourceA,
        nodes.bufferSourceB,
        nodes.bufferSourceAir,
    ]) {
        try {
            src.stop();
        } catch (e) {
            dropUnused(e);
        }
        src.disconnect();
    }
    for (const osc of [nodes.growlModOsc, nodes.snarlModOsc, nodes.lowModOsc]) {
        try {
            osc.stop();
        } catch (e) {
            dropUnused(e);
        }
        osc.disconnect();
    }
    nodes.growlModDepth.disconnect();
    nodes.snarlModDepth.disconnect();
    nodes.lowModDepth.disconnect();
    nodes.brownGainA.disconnect();
    nodes.brownGainB.disconnect();
    nodes.airHighPass.disconnect();
    nodes.airLowPass.disconnect();
    nodes.airGain.disconnect();
    nodes.lowPass.disconnect();
    nodes.bandPass.disconnect();
    nodes.highPass.disconnect();
    nodes.bandGainLow.disconnect();
    nodes.bandGainMid.disconnect();
    nodes.bandGainHigh.disconnect();
    nodes.preSatGain.disconnect();
    nodes.saturation.disconnect();
    nodes.growlPeak.disconnect();
    nodes.snarlPeak.disconnect();
    nodes.master.disconnect();
    nodes.bodyShelf.disconnect();
    nodes.darkShelf.disconnect();
    nodes.context.close().catch((e) => dropUnused(e));
}

export function createRocketEngineAudio(): RocketEngineAudioController {
    let graph: GraphNodes | null = null;
    let enabled = false;
    let lastThrottle = 0;
    let applyRafId: number | null = null;

    function cancelApplyRaf(): void {
        if (applyRafId !== null && typeof window !== "undefined") {
            window.cancelAnimationFrame(applyRafId);
            applyRafId = null;
        }
    }

    function scheduleApplyThrottle(): void {
        if (typeof window === "undefined" || applyRafId !== null) {
            return;
        }
        applyRafId = window.requestAnimationFrame(() => {
            applyRafId = null;
            if (!enabled || graph === null) {
                return;
            }
            applyThrottleToGraph(graph, lastThrottle);
        }) as unknown as number;
    }

    function ensureGraph(): GraphNodes | null {
        if (graph) {
            return graph;
        }
        if (typeof window === "undefined") {
            return null;
        }
        const Ctx =
            window.AudioContext ??
            (
                window as Window & {
                    webkitAudioContext?: typeof AudioContext;
                }
            ).webkitAudioContext;
        if (!Ctx) {
            return null;
        }
        const context = new Ctx();
        graph = buildGraph(context);
        return graph;
    }

    return {
        dispose(): void {
            cancelApplyRaf();
            if (graph) {
                teardownGraph(graph);
                graph = null;
            }
            enabled = false;
        },

        setEnabled(next: boolean): void {
            if (next === enabled) {
                return;
            }
            enabled = next;
            if (!enabled) {
                cancelApplyRaf();
                if (graph) {
                    silenceGraph(graph);
                }
                return;
            }
            const g = ensureGraph();
            if (!g) {
                enabled = false;
                return;
            }
            g.context.resume().catch((e) => dropUnused(e));
            cancelApplyRaf();
            applyThrottleToGraph(g, lastThrottle);
        },

        setThrottle(throttle: number): void {
            lastThrottle = clamp01(throttle);
            if (!enabled || graph === null) {
                return;
            }
            scheduleApplyThrottle();
        },
    };
}
