package back.ecommerce.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health") // La URL base que estabas probando
public class HealthController {

    @GetMapping
    public String checkHealth() {
        return "OK. El servicio está corriendo.";
    }
}