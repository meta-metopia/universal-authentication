// global.Response = class Response {
//   constructor(body, init) {
//     this.body = body;
//     this.init = init;
//   }

//   static json() {
//     return {};
//   }

//   getAll() {
//     return jest.fn();
//   }
// };

// jest.mock("next/server", () => ({
//   NextResponse: {
//     json: jest.fn((body, options) => {
//       return { status: options.status, body };
//     }),
//   },
// }));
