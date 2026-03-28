export const ROCKET_FIRE_FRAGMENT_SHADER = `
precision highp float;

uniform vec3 uBoundsMax;
uniform vec3 uBoundsMin;
uniform vec3 uCameraLocal;
uniform vec4 uLeadingColor;
uniform vec4 uTrailingColor;
uniform float uBrightnessExponential;
uniform float uBrightnessMultiplier;
uniform float uConeOffset;
uniform float uCones;
uniform vec3 uJetAxis;
uniform float uThrottle;
uniform float uTime;
uniform float uTurbulenceFactor;

varying vec3 vLocalPosition;

const float cRadianceScale = 0.3;

const float cVolumeDensityScale = 1.0;

const float cAlphaAbsorption = 3.2;

const int MARCH_STEPS = 128;

float saturate(float value) {
	return clamp(value, 0.0, 1.0);
}

float inverseLerp(float a, float b, float v) {
	return saturate((v - a) / max(b - a, 0.0001));
}

float remap(float inMin, float inMax, float outMin, float outMax, float v) {
	return mix(outMin, outMax, inverseLerp(inMin, inMax, v));
}

float piecewise3(float x, vec2 p0, vec2 p1, vec2 p2) {
	if (x <= p1.x) {
		return mix(p0.y, p1.y, inverseLerp(p0.x, p1.x, x));
	}
	return mix(p1.y, p2.y, inverseLerp(p1.x, p2.x, x));
}

vec3 mod289(vec3 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
	return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
	return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
	const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
	const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
	vec3 i = floor(v + dot(v, C.yyy));
	vec3 x0 = v - i + dot(i, C.xxx);
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.0 - g;
	vec3 i1 = min(g.xyz, l.zxy);
	vec3 i2 = max(g.xyz, l.zxy);
	vec3 x1 = x0 - i1 + C.xxx;
	vec3 x2 = x0 - i2 + C.yyy;
	vec3 x3 = x0 - D.yyy;
	i = mod289(i);
	vec4 p = permute(permute(permute(
		i.z + vec4(0.0, i1.z, i2.z, 1.0))
		+ i.y + vec4(0.0, i1.y, i2.y, 1.0))
		+ i.x + vec4(0.0, i1.x, i2.x, 1.0));
	float n_ = 0.142857142857;
	vec3 ns = n_ * D.wyz - D.xzx;
	vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.0 * x_);
	vec4 x = x_ * ns.x + ns.yyyy;
	vec4 y = y_ * ns.x + ns.yyyy;
	vec4 h = 1.0 - abs(x) - abs(y);
	vec4 b0 = vec4(x.xy, y.xy);
	vec4 b1 = vec4(x.zw, y.zw);
	vec4 s0 = floor(b0) * 2.0 + 1.0;
	vec4 s1 = floor(b1) * 2.0 + 1.0;
	vec4 sh = -step(h, vec4(0.0));
	vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
	vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
	vec3 p0 = vec3(a0.xy, h.x);
	vec3 p1 = vec3(a0.zw, h.y);
	vec3 p2 = vec3(a1.xy, h.z);
	vec3 p3 = vec3(a1.zw, h.w);
	vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;
	vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
	m = m * m;
	return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float snoise01(vec3 p) {
	return snoise(p) * 0.5 + 0.5;
}

float fbm2(vec3 p, float roughness) {
	float v = 0.0;
	float a = 0.5;
	float f = 1.0;
	float n = 0.0;
	for (int i = 0; i < 2; i++) {
		v += a * snoise01(p * f);
		n += a;
		f *= 2.0;
		a *= roughness;
	}
	return v / max(n, 1e-4);
}

float fbm15(vec3 p, float roughness) {
	float v = 0.0;
	float a = 0.5;
	float f = 1.0;
	float n = 0.0;
	for (int i = 0; i < 15; i++) {
		v += a * snoise01(p * f);
		n += a;
		f *= 2.0;
		a *= roughness;
	}
	return v / max(n, 1e-4);
}

vec2 intersectBox(vec3 rayOrigin, vec3 rayDirection, vec3 boxMin, vec3 boxMax) {
	vec3 invDir = 1.0 / rayDirection;
	vec3 t0 = (boxMin - rayOrigin) * invDir;
	vec3 t1 = (boxMax - rayOrigin) * invDir;
	vec3 tsmaller = min(t0, t1);
	vec3 tbigger = max(t0, t1);
	float tNear = max(max(tsmaller.x, tsmaller.y), tsmaller.z);
	float tFar = min(min(tbigger.x, tbigger.y), tbigger.z);
	return vec2(tNear, tFar);
}

float sampleConeSpacingCurve(float x) {
	return piecewise3(
		x,
		vec2(0.0, 0.6000000238418579),
		vec2(0.5054547786712646, 1.0),
		vec2(1.0, 0.6000000238418579)
	);
}

float sampleNoiseRamp(float x) {
	const float s0 = 0.06545454263687134;
	const float s1 = 0.29636386036872864;
	const float s2 = 0.6618185043334961;
	const float c1 = 0.284343421459198;
	if (x <= s0) {
		return 1.0;
	}
	if (x <= s1) {
		return mix(1.0, c1, smoothstep(s0, s1, x));
	}
	if (x <= s2) {
		return mix(c1, 0.0, smoothstep(s1, s2, x));
	}
	return 0.0;
}

float sampleConeBand(float x) {
	const float s0 = 0.01454545371234417;
	const float s1 = 0.04727290943264961;
	const float s2 = 0.08363701403141022;
	if (x <= s0) {
		return 0.0;
	}
	if (x <= s1) {
		return smoothstep(s0, s1, x);
	}
	if (x <= s2) {
		return 1.0 - smoothstep(s1, s2, x);
	}
	return 0.0;
}

float sampleInverseConeScale(float coneBell) {
	float b = saturate(coneBell);
	float eased = smoothstep(0.0, 1.0, b);
	float rampLum = 1.0 - eased;
	return mix(0.23000001907348633, 2.6500000953674316, rampLum);
}

float sampleOuterScale(float coneSpacing) {
	float t = saturate(inverseLerp(0.0, 0.9309091567993164, coneSpacing));
	return max(mix(1.0, 0.0001, t), 0.0001);
}

float sampleColorRamp003Factor(float t) {
	float u = inverseLerp(0.09090905636548996, 0.410909503698349, t);
	return smoothstep(0.0, 1.0, u);
}

float sampleFloatCurve001(float x) {
	return piecewise3(
		x,
		vec2(0.0, 0.0),
		vec2(0.7563633918762207, 0.23000018298625946),
		vec2(1.0, 1.0)
	);
}

float gradientQuadraticSphereFactor(vec3 p) {
	float r = max(0.999999 - length(p), 0.0);
	return r * r;
}

vec3 mappingRotZ(vec3 v, float rz) {
	float c = cos(rz);
	float s = sin(rz);
	return vec3(c * v.x - s * v.y, s * v.x + c * v.y, v.z);
}

vec3 toBlenderGeneratedSpace(vec3 gen, vec3 jetAxis) {
	if (jetAxis.x > 0.5) {
		return vec3(gen.y, gen.x, gen.z);
	}
	if (jetAxis.z > 0.5) {
		return vec3(gen.x, gen.z, gen.y);
	}
	return gen;
}

vec3 flipGeneratedAlongJet(vec3 gen, vec3 jetAxis) {
	if (jetAxis.x > 0.5) {
		gen.x = 1.0 - gen.x;
	} else if (jetAxis.z > 0.5) {
		gen.z = 1.0 - gen.z;
	} else {
		gen.y = 1.0 - gen.y;
	}
	return gen;
}

vec3 mapping001FromVector(vec3 v) {
	vec3 loc = vec3(mix(1.0, 0.0, saturate(uThrottle)), 1.0, -1.0);
	vec3 scaled = v * vec3(2.0, 1.0, 2.0);
	vec3 rotated = mappingRotZ(scaled, -1.5707963705062866);
	return rotated + loc;
}

float gradLinearMapping004(vec3 g) {
	return saturate(mappingRotZ(g, -1.5707963705062866).x);
}

vec3 mapping008Point(vec3 g) {
	return mappingRotZ(g, 1.5707963705062866) + vec3(1.0, 0.0, 0.0);
}

vec4 sampleFlame(vec3 point) {
	vec3 size = max(uBoundsMax - uBoundsMin, vec3(0.0001));
	vec3 gen = (point - uBoundsMin) / size;
	gen = flipGeneratedAlongJet(gen, uJetAxis);
	vec3 g = toBlenderGeneratedSpace(gen, uJetAxis);

	float gxRaw = gradLinearMapping004(g);

	float scrollY = uTime * -2.5999999046325684;
	vec3 genScrolled = gen;
	genScrolled.y += scrollY;
	vec3 gScrolled = toBlenderGeneratedSpace(genScrolled, uJetAxis);

	vec3 n1 = vec3(
		fbm2(gScrolled * 3.0 + vec3(0.0, 0.0, 0.0), 0.7133333683013916),
		fbm2(gScrolled * 3.0 + vec3(5.2, 1.3, 0.0), 0.7133333683013916),
		fbm2(gScrolled * 3.0 + vec3(0.0, 9.7, 2.8), 0.7133333683013916)
	);
	vec3 distortedCoord = mix(gScrolled, n1, 0.5400000214576721);
	vec3 mapped5 = distortedCoord * vec3(1.0, 0.28, 1.0) + vec3(0.0, 0.99, 0.0);

	float turbScroll = uTime * -5.0;
	vec3 turbLocal = gen * vec3(1.0, 1.38, 1.0) + vec3(0.0, turbScroll, 0.0);
	vec3 turbIn = toBlenderGeneratedSpace(turbLocal, uJetAxis);

	vec3 n2 = vec3(
		fbm15(turbIn * 8.0 + vec3(0.0, turbScroll * 0.35, 0.1), 0.5),
		fbm15(turbIn * 8.0 + vec3(9.2, 3.1, turbScroll * 0.2), 0.5),
		fbm15(turbIn * 8.0 + vec3(2.2, 8.4, turbScroll * 0.15), 0.5)
	);

	float gradForMix004 = saturate(mapping008Point(g).x);
	float toMinMap2 = mix(1.0, 0.5, saturate(uTurbulenceFactor));
	float mix4factor = remap(0.0, 1.0, toMinMap2, 1.0, gradForMix004);
	vec3 mix4 = mix(n2, g, mix4factor);

	vec3 reroute004 = mapping001FromVector(mix4);

	float invCones = 1.0 / max(uCones, 0.001);
	float math009 = abs(gxRaw + uConeOffset / 5.0);
	float math008 = math009 - invCones * floor(math009 / invCones);
	float coneFactor = saturate(math008 / invCones);
	float coneBell = sampleConeSpacingCurve(coneFactor);

	float math002 = 1.0 / max(coneBell, 0.0001);
	vec3 vMappedCone = reroute004 * vec3(1.0, math002, math002);
	float qsCone = gradientQuadraticSphereFactor(vMappedCone);
	float coneSphereBand = sampleConeBand(qsCone) * 18.799999237060547;

	float outerRamp = sampleOuterScale(coneBell);
	float m13 = 1.0 / max(outerRamp, 0.0001);
	vec3 vMappedOuter = reroute004 * vec3(1.0, m13, m13);
	float g4fac = gradientQuadraticSphereFactor(vMappedOuter);

	float cr4 = 1.0 - saturate(gxRaw);
	float fc1 = sampleFloatCurve001(cr4);
	float intensityFalloff = remap(0.0, 1.0, 0.0, 9.0 * saturate(uThrottle), fc1);

	float noiseMask = saturate(fbm15(mapped5 * 17.35999870300293, 0.4866666793823242));
	float noiseRamp = sampleNoiseRamp(noiseMask);

	float inverseConeScale = sampleInverseConeScale(coneBell);
	float math003 = inverseConeScale * coneSphereBand;
	float math006 = math003 * 2.0 * intensityFalloff;

	float math010 = coneSphereBand * 0.10000000149011612;
	float math019 = g4fac * 75.0;
	float math012 = math010 + math019;
	float math015 = pow(max(math012, 0.0), 1.6699999570846558);
	float math016 = math015 * intensityFalloff;
	float math014 = math006 + math016;
	float math011 = math014 * noiseRamp;
	float math021 = pow(max(math011, 0.0), uBrightnessExponential);
	float emissionStrength = math021 * uBrightnessMultiplier;

	float colorMix = sampleColorRamp003Factor(gxRaw);
	vec3 emissionColor = mix(uLeadingColor.rgb, uTrailingColor.rgb, colorMix);

	float density = emissionStrength * cVolumeDensityScale;
	return vec4(emissionColor * emissionStrength, density);
}

vec3 ACESFilmic(vec3 x) {
	x *= 0.6;
	float a = 2.51;
	float b = 0.03;
	float c = 2.43;
	float d = 0.59;
	float e = 0.14;
	return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

vec3 linearToSRGB(vec3 c) {
	vec3 lo = c * 12.92;
	vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
	return mix(lo, hi, step(vec3(0.0031308), c));
}

void main() {
	vec3 rayDirection = normalize(vLocalPosition - uCameraLocal);
	vec2 hit = intersectBox(uCameraLocal, rayDirection, uBoundsMin, uBoundsMax);
	float tNear = max(hit.x, 0.0);
	float tFar = hit.y;

	if (tFar <= tNear) {
		discard;
	}

	float marchLength = tFar - tNear;
	if (marchLength <= 0.0) {
		discard;
	}

	float stepSize = marchLength / float(MARCH_STEPS);
	vec3 accumColor = vec3(0.0);
	float accumTau = 0.0;
	float travel = tNear;

	for (int i = 0; i < MARCH_STEPS; i++) {
		vec3 samplePoint = uCameraLocal + rayDirection * (travel + stepSize * 0.5);
		vec4 flame = sampleFlame(samplePoint);
		accumColor += flame.rgb * stepSize;
		accumTau += flame.a * stepSize;
		travel += stepSize;
		if (travel >= tFar) {
			break;
		}
	}

	if (length(accumColor) < 1e-6) {
		discard;
	}

	float alpha = 1.0 - exp(-accumTau * cAlphaAbsorption);
	vec3 hdr = accumColor * cRadianceScale;
	vec3 mapped = ACESFilmic(hdr);
	gl_FragColor = vec4(linearToSRGB(mapped), saturate(alpha));
}
`;
