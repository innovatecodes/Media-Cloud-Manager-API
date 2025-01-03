import { app } from "./app";
import { loadNodeEnvironment } from "./app/utils/dotenv.config";

loadNodeEnvironment();

// app.listen(Number(process.env.PORT || process.env.STATIC_PORT), `${process.env.SERVER_URL}`, () => {
//   console.log(
//     `Server running on port ${process.env.PORT || process.env.STATIC_PORT}`
//   );
// });

app.listen(Number(process.env.PORT || process.env.STATIC_PORT), `${process.env.SERVER_URL}`);
