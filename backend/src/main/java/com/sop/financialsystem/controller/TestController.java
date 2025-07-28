package com.sop.financialsystem.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping
    public Map<String, String> test() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "✅ Backend funcionando!");
        response.put("message", "API REST do Sistema Financeiro SOP está rodando");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
