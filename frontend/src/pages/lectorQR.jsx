import React, { Component } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import '../pages/styles/QrScanner.css'; 

class QrScanner extends Component {
  constructor(props) {
    super(props);
    this.html5QrCode = null;
    this.qrCodeId = 'qr-reader';
  }

  componentDidMount() {
    this.startScanner();
  }

  async startScanner() {
    const { onDecode } = this.props;
    
    // Inicializamos la instancia manual
    this.html5QrCode = new Html5Qrcode(this.qrCodeId);

    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 } 
    };

    try {
      // Forzamos el uso de la cámara trasera (environment)
      await this.html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        (decodedText) => {
          onDecode(decodedText);
          this.stopScanner();
        },
        () => { /* Error de escaneo silencioso */ }
      );
    } catch (err) {
      console.error("Error al iniciar la cámara:", err);
    }
  }

  async stopScanner() {
    if (this.html5QrCode && this.html5QrCode.isScanning) {
      try {
        await this.html5QrCode.stop();
        this.html5QrCode.clear();
      } catch (err) {
        console.error("Error al detener el scanner:", err);
      }
    }
  }

  componentWillUnmount() {
    this.stopScanner();
  }

  render() {
    const { onClose } = this.props;

    return (
      <div className="qr-overlay">
        <div className="qr-modal">
          <div className="qr-header">
             <h2 className="qr-title">Escanea el código</h2>
             <p className="qr-hint">Apuntá al QR del vehículo</p>
          </div>

          <div className="qr-camera-container">
            <div id={this.qrCodeId} className="qr-video-feed" />
            {/* Marco decorativo para simular el escaneo */}
            <div className="qr-scanner-overlay">
                <div className="qr-target-box"></div>
            </div>
          </div>

          <button className="qr-close-btn" onClick={() => {
            this.stopScanner().then(() => onClose());
          }}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }
}

export default QrScanner;