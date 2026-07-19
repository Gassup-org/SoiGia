import app from "./app.ts";
import config from "./config/app.config.ts";

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});