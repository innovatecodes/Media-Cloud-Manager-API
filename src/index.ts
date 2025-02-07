import { app } from "./app.js";
import { loadNodeEnvironment } from "./app/utils/dotenv.config.js";

loadNodeEnvironment();

app.listen(process.env.PORT || process.env.STATIC_PORT);
