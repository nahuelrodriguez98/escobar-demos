const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

module.exports = async function generarQR(vehiculo) {
  try {
    const data = {
      id: vehiculo.id,
      patente: vehiculo.patente,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      concesionaria_id: vehiculo.concesionaria_id,
      activo: vehiculo.activo,
      anio: vehiculo.anio ?? null
    };

    const qrData = JSON.stringify(data);

    const dir = path.join(__dirname, "..", "qrs");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });


    const modeloCorto = vehiculo.modelo.split(" ")[0];
    const filePath = path.join(dir,`${modeloCorto}_${vehiculo.patente}.png`);

    await QRCode.toFile(filePath, qrData);

    return filePath;
  } catch (err) {
    console.error("Error generando QR:", err);
    throw err;
  }
};
