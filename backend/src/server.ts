
import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`PyMEFlow API disponible en http://localhost:${PORT}`);
  console.log(`Verificación: http://localhost:${PORT}/health`);
});
