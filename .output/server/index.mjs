globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/arrow-right-Dvhkz1ee.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-Jaqq4TUsDFaDN+9WutSO0KId4NE\"",
		"mtime": "2026-07-28T11:30:36.970Z",
		"size": 155,
		"path": "../public/assets/arrow-right-Dvhkz1ee.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-07-15T13:07:29.969Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/auth-amevSuNo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1271-LbtW2ZzkPj9nTrJk3X6DrXVUxd8\"",
		"mtime": "2026-07-28T11:30:36.970Z",
		"size": 4721,
		"path": "../public/assets/auth-amevSuNo.js"
	},
	"/assets/check-9z8MdEPT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72-xHaqah2Bp3dQbjgEr1XSgNAs7ys\"",
		"mtime": "2026-07-28T11:30:36.973Z",
		"size": 114,
		"path": "../public/assets/check-9z8MdEPT.js"
	},
	"/assets/book-open-q_SeeoG0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-MYulftTI50SapRHemHfwpUfWG/Y\"",
		"mtime": "2026-07-28T11:30:36.970Z",
		"size": 269,
		"path": "../public/assets/book-open-q_SeeoG0.js"
	},
	"/assets/chevron-right-J3LT-smL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"78-GzkFirJZrE+YaA/1oYWWF6lD+AQ\"",
		"mtime": "2026-07-28T11:30:36.974Z",
		"size": 120,
		"path": "../public/assets/chevron-right-J3LT-smL.js"
	},
	"/assets/circle-check-dLASjll9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a8-9yEWgx95oQwSStK1DyGbDlVBomE\"",
		"mtime": "2026-07-28T11:30:36.974Z",
		"size": 168,
		"path": "../public/assets/circle-check-dLASjll9.js"
	},
	"/assets/dist-DC2ZaTzR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a72-ywuOk6RmRhA+LftsQj69aqVC3nU\"",
		"mtime": "2026-07-28T11:30:36.974Z",
		"size": 19058,
		"path": "../public/assets/dist-DC2ZaTzR.js"
	},
	"/assets/Footer-rIPSeVQC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1835-H11chPSREjo/3WAsJeRr/NkNcr8\"",
		"mtime": "2026-07-28T11:30:36.970Z",
		"size": 6197,
		"path": "../public/assets/Footer-rIPSeVQC.js"
	},
	"/assets/faq-BDlOCcIQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86a-/SvhwisRU8NP5rYdju6rVzNdOxA\"",
		"mtime": "2026-07-28T11:30:36.974Z",
		"size": 2154,
		"path": "../public/assets/faq-BDlOCcIQ.js"
	},
	"/assets/inter-cyrillic-wght-normal-DqGufNeO.woff2": {
		"type": "font/woff2",
		"etag": "\"493c-n3Oy9D6jvzfMjpClqox+Zo7ERQQ\"",
		"mtime": "2026-07-28T11:30:36.977Z",
		"size": 18748,
		"path": "../public/assets/inter-cyrillic-wght-normal-DqGufNeO.woff2"
	},
	"/assets/dashboard-preview-DMtArcOQ.jpg": {
		"type": "image/jpeg",
		"etag": "\"23f02-ypnMVALRbA/U1AZLC/T5KCqD4xc\"",
		"mtime": "2026-07-28T11:30:36.976Z",
		"size": 147202,
		"path": "../public/assets/dashboard-preview-DMtArcOQ.jpg"
	},
	"/assets/inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2": {
		"type": "font/woff2",
		"etag": "\"6568-cF1iUGbboMFZ8TfnP5HiMgl9II0\"",
		"mtime": "2026-07-28T11:30:36.977Z",
		"size": 25960,
		"path": "../public/assets/inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2"
	},
	"/assets/inter-greek-ext-wght-normal-DlzME5K_.woff2": {
		"type": "font/woff2",
		"etag": "\"2be0-BP5iTzJeB8nLqYAgKpWNi5o1Zm8\"",
		"mtime": "2026-07-28T11:30:36.977Z",
		"size": 11232,
		"path": "../public/assets/inter-greek-ext-wght-normal-DlzME5K_.woff2"
	},
	"/assets/inter-greek-wght-normal-CkhJZR-_.woff2": {
		"type": "font/woff2",
		"etag": "\"4a34-xor/hj4YNqI52zFecXnUbzQ4Xs4\"",
		"mtime": "2026-07-28T11:30:36.977Z",
		"size": 18996,
		"path": "../public/assets/inter-greek-wght-normal-CkhJZR-_.woff2"
	},
	"/assets/inter-latin-wght-normal-Dx4kXJAl.woff2": {
		"type": "font/woff2",
		"etag": "\"bc80-8R1ym7Ck2DUNLqPQ/AYs9u8tUpg\"",
		"mtime": "2026-07-28T11:30:36.977Z",
		"size": 48256,
		"path": "../public/assets/inter-latin-wght-normal-Dx4kXJAl.woff2"
	},
	"/assets/hero-ai-DNEPr7Zq.jpg": {
		"type": "image/jpeg",
		"etag": "\"307c7-+Xx0xI8z/QOj2ANf7/cMMefelJo\"",
		"mtime": "2026-07-28T11:30:36.976Z",
		"size": 198599,
		"path": "../public/assets/hero-ai-DNEPr7Zq.jpg"
	},
	"/assets/interview-DJG7W9hV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c19-bD7TBpD0UXNedzATVEsu0OAynKg\"",
		"mtime": "2026-07-28T11:30:36.974Z",
		"size": 15385,
		"path": "../public/assets/interview-DJG7W9hV.js"
	},
	"/assets/inter-vietnamese-wght-normal-CBcvBZtf.woff2": {
		"type": "font/woff2",
		"etag": "\"280c-nBythjoDQ0+5wVAendJ6wU7Xz2M\"",
		"mtime": "2026-07-28T11:30:36.978Z",
		"size": 10252,
		"path": "../public/assets/inter-vietnamese-wght-normal-CBcvBZtf.woff2"
	},
	"/assets/pricing-DY_6Hmtx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c24-y5HgOU/V+RMW0pQeJ6OvdtGCI9I\"",
		"mtime": "2026-07-28T11:30:36.974Z",
		"size": 3108,
		"path": "../public/assets/pricing-DY_6Hmtx.js"
	},
	"/assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2": {
		"type": "font/woff2",
		"etag": "\"14c4c-zz61D7IQFMB9QxHvTAOk/Vh4ibQ\"",
		"mtime": "2026-07-28T11:30:36.977Z",
		"size": 85068,
		"path": "../public/assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2"
	},
	"/assets/proxy-C-btFnMj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d810-QFaBfgbA9HrD9rOv604rfJJQcWk\"",
		"mtime": "2026-07-28T11:30:36.975Z",
		"size": 120848,
		"path": "../public/assets/proxy-C-btFnMj.js"
	},
	"/assets/refresh-cw-Dv-UCBYt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137-Vr+6k7RODbOyvH2FPebw16xdr2k\"",
		"mtime": "2026-07-28T11:30:36.975Z",
		"size": 311,
		"path": "../public/assets/refresh-cw-Dv-UCBYt.js"
	},
	"/assets/report-w423G4BE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2879-kUPTLhcpItnqBxTltTBZPWDNNOE\"",
		"mtime": "2026-07-28T11:30:36.975Z",
		"size": 10361,
		"path": "../public/assets/report-w423G4BE.js"
	},
	"/assets/index-Bcw9HQqX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ed38-rSUIsg/7Ej8joblBiPZUhhdf2o0\"",
		"mtime": "2026-07-28T11:30:36.970Z",
		"size": 585016,
		"path": "../public/assets/index-Bcw9HQqX.js"
	},
	"/assets/resume.functions-Bgc1caXe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b27-pdtySA4lPzVmAqAv3/b9dr8f2YM\"",
		"mtime": "2026-07-28T11:30:36.975Z",
		"size": 15143,
		"path": "../public/assets/resume.functions-Bgc1caXe.js"
	},
	"/assets/resume-7_WTsxrf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3678-U1A+vHu6wvEOpAUGdEtiufIaZT8\"",
		"mtime": "2026-07-28T11:30:36.975Z",
		"size": 13944,
		"path": "../public/assets/resume-7_WTsxrf.js"
	},
	"/assets/roadmap-BpsuMUzH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25c2-o2DkwlgfA7TwTfvgAtdLQwXKRtE\"",
		"mtime": "2026-07-28T11:30:36.975Z",
		"size": 9666,
		"path": "../public/assets/roadmap-BpsuMUzH.js"
	},
	"/assets/routes-DNqDW9br.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3051-HZDpvpTRqzWSenNjVvJ6Irg3tOI\"",
		"mtime": "2026-07-28T11:30:36.975Z",
		"size": 12369,
		"path": "../public/assets/routes-DNqDW9br.js"
	},
	"/assets/space-grotesk-latin-500-normal-CNSSEhBt.woff": {
		"type": "font/woff",
		"etag": "\"425c-1Gf7i6aAUt1Fd7tGn4+HkNYVOw0\"",
		"mtime": "2026-07-28T11:30:36.978Z",
		"size": 16988,
		"path": "../public/assets/space-grotesk-latin-500-normal-CNSSEhBt.woff"
	},
	"/assets/route-CrglJCIP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-bOLLadGJadjv0Kw4ZTQtoExXE20\"",
		"mtime": "2026-07-28T11:30:36.975Z",
		"size": 138,
		"path": "../public/assets/route-CrglJCIP.js"
	},
	"/assets/space-grotesk-latin-400-normal-CJ-V5oYT.woff2": {
		"type": "font/woff2",
		"etag": "\"344c-4RfT7aFk3EnbF6Hh/aQS0Dwt6dI\"",
		"mtime": "2026-07-28T11:30:36.978Z",
		"size": 13388,
		"path": "../public/assets/space-grotesk-latin-400-normal-CJ-V5oYT.woff2"
	},
	"/assets/space-grotesk-latin-400-normal-BnQMeOim.woff": {
		"type": "font/woff",
		"etag": "\"426c-ghmNOmJRvnMHZL5v05+7tCgOuLs\"",
		"mtime": "2026-07-28T11:30:36.978Z",
		"size": 17004,
		"path": "../public/assets/space-grotesk-latin-400-normal-BnQMeOim.woff"
	},
	"/assets/space-grotesk-latin-600-normal-BflQw4A9.woff": {
		"type": "font/woff",
		"etag": "\"41f4-A1LHI2d4uZUcNIX0toiV/mWCn98\"",
		"mtime": "2026-07-28T11:30:36.978Z",
		"size": 16884,
		"path": "../public/assets/space-grotesk-latin-600-normal-BflQw4A9.woff"
	},
	"/assets/space-grotesk-latin-600-normal-DjKNqYRj.woff2": {
		"type": "font/woff2",
		"etag": "\"33e4-2jIlH+AsPyFgIaKwqDO5WYXfeQY\"",
		"mtime": "2026-07-28T11:30:36.979Z",
		"size": 13284,
		"path": "../public/assets/space-grotesk-latin-600-normal-DjKNqYRj.woff2"
	},
	"/assets/space-grotesk-latin-500-normal-lFbtlQH6.woff2": {
		"type": "font/woff2",
		"etag": "\"3400-3SdZBxxMFqhCiNds2b7VWFQknAo\"",
		"mtime": "2026-07-28T11:30:36.978Z",
		"size": 13312,
		"path": "../public/assets/space-grotesk-latin-500-normal-lFbtlQH6.woff2"
	},
	"/assets/space-grotesk-latin-700-normal-CwsQ-cCU.woff": {
		"type": "font/woff",
		"etag": "\"4020-6+Lv6SyfClI9gHZHIfMCmlje8BE\"",
		"mtime": "2026-07-28T11:30:36.979Z",
		"size": 16416,
		"path": "../public/assets/space-grotesk-latin-700-normal-CwsQ-cCU.woff"
	},
	"/assets/space-grotesk-latin-700-normal-RjhwGPKo.woff2": {
		"type": "font/woff2",
		"etag": "\"3228-CUaBya012LbSd7QFPXYy34srV9k\"",
		"mtime": "2026-07-28T11:30:36.980Z",
		"size": 12840,
		"path": "../public/assets/space-grotesk-latin-700-normal-RjhwGPKo.woff2"
	},
	"/assets/space-grotesk-latin-ext-400-normal-CfP_5XZW.woff2": {
		"type": "font/woff2",
		"etag": "\"2fe0-c3xYOMmU2wqZgHAe410CnfS5OGE\"",
		"mtime": "2026-07-28T11:30:36.980Z",
		"size": 12256,
		"path": "../public/assets/space-grotesk-latin-ext-400-normal-CfP_5XZW.woff2"
	},
	"/assets/space-grotesk-latin-ext-500-normal-3dgZTiw9.woff": {
		"type": "font/woff",
		"etag": "\"4194-lEc2+CK+OmFY8daY+Wm75LFagxg\"",
		"mtime": "2026-07-28T11:30:36.980Z",
		"size": 16788,
		"path": "../public/assets/space-grotesk-latin-ext-500-normal-3dgZTiw9.woff"
	},
	"/assets/space-grotesk-latin-ext-500-normal-DUe3BAxM.woff2": {
		"type": "font/woff2",
		"etag": "\"2ff0-mtGWYEDYMf3fdjHjQ1RuTjmuuKI\"",
		"mtime": "2026-07-28T11:30:36.980Z",
		"size": 12272,
		"path": "../public/assets/space-grotesk-latin-ext-500-normal-DUe3BAxM.woff2"
	},
	"/assets/space-grotesk-latin-ext-600-normal-DxxdqCpr.woff2": {
		"type": "font/woff2",
		"etag": "\"3000-6K2CsKJNrxHeh6w0a0WeKzYg/RY\"",
		"mtime": "2026-07-28T11:30:36.981Z",
		"size": 12288,
		"path": "../public/assets/space-grotesk-latin-ext-600-normal-DxxdqCpr.woff2"
	},
	"/assets/space-grotesk-latin-ext-600-normal-VcznFIpX.woff": {
		"type": "font/woff",
		"etag": "\"4158-hXJ05iafhGTLOF1Sjuwds70aYJk\"",
		"mtime": "2026-07-28T11:30:36.981Z",
		"size": 16728,
		"path": "../public/assets/space-grotesk-latin-ext-600-normal-VcznFIpX.woff"
	},
	"/assets/space-grotesk-latin-ext-400-normal-DRPE3kg4.woff": {
		"type": "font/woff",
		"etag": "\"4194-65sd2rUQ1RXSRzlf/UdsfnxLy8Q\"",
		"mtime": "2026-07-28T11:30:36.980Z",
		"size": 16788,
		"path": "../public/assets/space-grotesk-latin-ext-400-normal-DRPE3kg4.woff"
	},
	"/assets/space-grotesk-latin-ext-700-normal-BQnZhY3m.woff2": {
		"type": "font/woff2",
		"etag": "\"2ed8-TBMRoktioCogW6/NM520zKySXcU\"",
		"mtime": "2026-07-28T11:30:36.981Z",
		"size": 11992,
		"path": "../public/assets/space-grotesk-latin-ext-700-normal-BQnZhY3m.woff2"
	},
	"/assets/space-grotesk-latin-ext-700-normal-HVCqSBdx.woff": {
		"type": "font/woff",
		"etag": "\"404c-FfjgS7J3XUuOSTAwuPCMJSSAvt0\"",
		"mtime": "2026-07-28T11:30:36.981Z",
		"size": 16460,
		"path": "../public/assets/space-grotesk-latin-ext-700-normal-HVCqSBdx.woff"
	},
	"/assets/space-grotesk-vietnamese-400-normal-B7xT_GF5.woff2": {
		"type": "font/woff2",
		"etag": "\"10c8-1JGRw5hFjWC+pPUJ6csycnKgHxA\"",
		"mtime": "2026-07-28T11:30:36.981Z",
		"size": 4296,
		"path": "../public/assets/space-grotesk-vietnamese-400-normal-B7xT_GF5.woff2"
	},
	"/assets/space-grotesk-vietnamese-400-normal-BIWiOVfw.woff": {
		"type": "font/woff",
		"etag": "\"1660-Gmat2y5b870gScU9KClIjJn3GqI\"",
		"mtime": "2026-07-28T11:30:36.981Z",
		"size": 5728,
		"path": "../public/assets/space-grotesk-vietnamese-400-normal-BIWiOVfw.woff"
	},
	"/assets/space-grotesk-vietnamese-500-normal-BmEvtly_.woff2": {
		"type": "font/woff2",
		"etag": "\"10e4-UNTFOrnCmfOI7UspLiuWXm466zw\"",
		"mtime": "2026-07-28T11:30:36.982Z",
		"size": 4324,
		"path": "../public/assets/space-grotesk-vietnamese-500-normal-BmEvtly_.woff2"
	},
	"/assets/space-grotesk-vietnamese-500-normal-BTqKIpxg.woff": {
		"type": "font/woff",
		"etag": "\"1654-JlaMSeciVxCokGS+Dt+IN52KVoc\"",
		"mtime": "2026-07-28T11:30:36.981Z",
		"size": 5716,
		"path": "../public/assets/space-grotesk-vietnamese-500-normal-BTqKIpxg.woff"
	},
	"/assets/space-grotesk-vietnamese-600-normal-D6zpsUhD.woff": {
		"type": "font/woff",
		"etag": "\"1648-U831D1UvvnP2XK3oeBMahBZ6uAA\"",
		"mtime": "2026-07-28T11:30:36.982Z",
		"size": 5704,
		"path": "../public/assets/space-grotesk-vietnamese-600-normal-D6zpsUhD.woff"
	},
	"/assets/space-grotesk-vietnamese-600-normal-DUi7WF5p.woff2": {
		"type": "font/woff2",
		"etag": "\"10d8-zLY8xT+eAaR0b+FEszj/7T+CXbA\"",
		"mtime": "2026-07-28T11:30:36.982Z",
		"size": 4312,
		"path": "../public/assets/space-grotesk-vietnamese-600-normal-DUi7WF5p.woff2"
	},
	"/assets/space-grotesk-vietnamese-700-normal-DMty7AZE.woff2": {
		"type": "font/woff2",
		"etag": "\"106c-OvrbrxRBqhaoWMfcV7ZXQfDd/bQ\"",
		"mtime": "2026-07-28T11:30:36.982Z",
		"size": 4204,
		"path": "../public/assets/space-grotesk-vietnamese-700-normal-DMty7AZE.woff2"
	},
	"/assets/styles-YPSUpIXY.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"15a90-YhBgrCmHB5Q3T51ZidIgL3Qeh/A\"",
		"mtime": "2026-07-28T11:30:36.983Z",
		"size": 88720,
		"path": "../public/assets/styles-YPSUpIXY.css"
	},
	"/assets/space-grotesk-vietnamese-700-normal-Duxec5Rn.woff": {
		"type": "font/woff",
		"etag": "\"15d4-G/yewNcLknFzx6or6nPJYti8zRg\"",
		"mtime": "2026-07-28T11:30:36.982Z",
		"size": 5588,
		"path": "../public/assets/space-grotesk-vietnamese-700-normal-Duxec5Rn.woff"
	},
	"/assets/target-BB_bBt6E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d8-7klUq7/y3JLcstOq90um1ELBNI0\"",
		"mtime": "2026-07-28T11:30:36.976Z",
		"size": 216,
		"path": "../public/assets/target-BB_bBt6E.js"
	},
	"/assets/trophy-BzHXR1sc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24c-E+o9pbwlb3O1lbMXDx29+i4LGqo\"",
		"mtime": "2026-07-28T11:30:36.976Z",
		"size": 588,
		"path": "../public/assets/trophy-BzHXR1sc.js"
	},
	"/assets/useStore-B1lxGYAf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6cda-p+dWjUPyFMGjfaeeQzEMcvGGasE\"",
		"mtime": "2026-07-28T11:30:36.976Z",
		"size": 27866,
		"path": "../public/assets/useStore-B1lxGYAf.js"
	},
	"/assets/useMutation-FVdZu0Xi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c7-okPJ2IaUkRj4dh2bbDqFYux7lBE\"",
		"mtime": "2026-07-28T11:30:36.976Z",
		"size": 2247,
		"path": "../public/assets/useMutation-FVdZu0Xi.js"
	},
	"/assets/use-require-resume-DVudEvXq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22d-m2RdCnIwL29aPVHupPhAdFd0gFM\"",
		"mtime": "2026-07-28T11:30:36.976Z",
		"size": 557,
		"path": "../public/assets/use-require-resume-DVudEvXq.js"
	},
	"/assets/video-CudrDg-0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a4-+/AauirAy9/TVH6Ko3Pj57L4v9s\"",
		"mtime": "2026-07-28T11:30:36.976Z",
		"size": 420,
		"path": "../public/assets/video-CudrDg-0.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_LCySpE = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_LCySpE
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
