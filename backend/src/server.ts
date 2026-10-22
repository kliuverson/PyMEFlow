import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`PyMEFlow API disponible en http://localhost:${env.PORT}`);
  console.log(`Verificación: http://localhost:${env.PORT}/health`);
});