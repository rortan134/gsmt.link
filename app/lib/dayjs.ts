// biome-ignore lint/style/noExportedImports: Intentional
import dayjs from "dayjs";
import "dayjs/locale/da";
import "dayjs/locale/de";
import "dayjs/locale/en";
import "dayjs/locale/es";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import minmax from "dayjs/plugin/minMax";
import relativeTime from "dayjs/plugin/relativeTime";
import timeZone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(timeZone);
dayjs.extend(utc);
dayjs.extend(minmax);

export type Dayjs = dayjs.Dayjs;

export type { ConfigType } from "dayjs";

export { dayjs };
