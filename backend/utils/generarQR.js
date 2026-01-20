const QRCode = require("qrcode");

module.exports = async function generarQR(vehiculo) {
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

  const qrBase64 = await QRCode.toDataURL(qrData); // 👈 NO filesystem

  return qrBase64;
};
