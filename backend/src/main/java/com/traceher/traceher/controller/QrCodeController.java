package com.traceher.traceher.controller;

import com.traceher.traceher.service.QrCodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qrcodes")
public class QrCodeController {

    private final QrCodeService qrCodeService;

    public QrCodeController(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateQrCodes(@RequestParam Long productBatchId,
                                             @RequestParam Integer quantity) {
        try {
            return ResponseEntity.ok(qrCodeService.generateQrCodes(productBatchId, quantity));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/activate")
    public ResponseEntity<?> activateQrCode(@RequestParam String qrCodeValue) {
        try {
            return ResponseEntity.ok(qrCodeService.activateQrCode(qrCodeValue));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/info")
    public ResponseEntity<?> getQrCodeInfo(@RequestParam String qrCodeValue) {
        try {
            return ResponseEntity.ok(qrCodeService.getQrCodeInfo(qrCodeValue));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}