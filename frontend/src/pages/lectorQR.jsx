import React, { Component } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../pages/styles/QrScanner.css'; 

class QrScanner extends Component {
  constructor(props) {
    super(props);
    this.scanner = null;
    this.qrCodeId = 'qr-reader';
  }

  componentDidMount() {
    const { onDecode } = this.props;

    this.scanner = new Html5QrcodeScanner(
      this.qrCodeId,
      { fps: 10, qrbox: 250 },
      false
    );

    this.scanner.render(
      (decodedText) => {
        onDecode(decodedText);
        this.scanner.clear().catch(err =>
          console.error("Error al limpiar el scanner:", err)
        );
      },
      () => {}
    );
  }

  componentWillUnmount() {
    if (this.scanner) {
      this.scanner.clear().catch(err =>
        console.error("Error al limpiar el scanner:", err)
      );
    }
  }

  render() {
    const { onClose } = this.props;

    return (
      <div className="qr-overlay">
        <div className="qr-modal">
          <h2 className="qr-title">Escanear código QR</h2>

          <p className="qr-hint">
            Apuntá la cámara al QR del vehículo
          </p>

          <div className="qr-camera-wrapper">
            <div id={this.qrCodeId} className="qr-reader" />
          </div>

          <button className="qr-close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }
}

export default QrScanner;
