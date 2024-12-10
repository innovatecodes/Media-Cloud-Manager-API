import app from "./app";
import { loadNodeEnvironment } from "./app/utils/utils";

loadNodeEnvironment();

app.listen(process.env.PORT || process.env.STATIC_PORT, () => {
  console.log(
    `Server running on port ${process.env.PORT || process.env.STATIC_PORT}`
  );
});
