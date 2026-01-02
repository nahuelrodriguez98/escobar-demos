import React, { Component } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../pages/styles/QrScanner.css'; 

class QrScanner extends Component {
  constructor(props) {
    super(props);
    this.scanner = null;
    this.qrCodeId = 'qr-reader';
  }

  // Se ejecuta después de que el componente se monta
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
        this.scanner.clear().catch(error => console.error("Error al limpiar el scanner:", error));
      },
      (err) => {
        
      }
    );
  }

  componentWillUnmount() {
    if (this.scanner) {
      this.scanner.clear().catch(error => console.error("Error al limpiar el scanner:", error));
    }
  }

  render() {
    const { onClose } = this.props;

    return (
      <div className="qr-scanner-overlay">
        <div className="qr-scanner-modal">
          <h2 className="qr-scanner-title">Escanear Código QR</h2>
          
          <div id={this.qrCodeId} className="qr-reader-viewport"></div>
          
          <button className="close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }
}

export default QrScanner;