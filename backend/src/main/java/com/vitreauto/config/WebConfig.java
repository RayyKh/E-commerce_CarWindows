package com.vitreauto.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String path = uploadDir;
        if (!path.startsWith("file:")) {
            if (!path.startsWith("/")) {
                path = "file:/" + path;
            } else {
                path = "file:" + path;
            }
        }
        if (!path.endsWith("/")) {
            path += "/";
        }
        
        registry.addResourceHandler("/api/images/**")
                .addResourceLocations(path)
                .setCachePeriod(3600);
    }
}
