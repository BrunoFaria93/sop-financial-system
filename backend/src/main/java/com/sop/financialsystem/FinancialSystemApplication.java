package com.sop.financialsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FinancialSystemApplication {

    public static void main(String[] args) {
        System.out.println("🚀 Iniciando Sistema Financeiro SOP...");
        SpringApplication.run(FinancialSystemApplication.class, args);
        System.out.println("✅ Sistema iniciado! Acesse: http://localhost:8080/api/test");
    }
}
