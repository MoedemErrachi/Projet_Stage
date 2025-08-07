package com.example.taskmanager.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/files")
public class FileController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @GetMapping("/download/{type}/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String type, @PathVariable String filename) {
        try {
            // Construct file path based on type (task, response, application, or document)
            String folderName = type + "s";
            Path filePath = Paths.get(uploadDir).resolve(folderName).resolve(filename).normalize();
            
            System.out.println("Looking for file at: " + filePath.toAbsolutePath());
            System.out.println("File exists: " + Files.exists(filePath));
            
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Determine content type
                String contentType = "application/octet-stream";
                
                try {
                    contentType = Files.probeContentType(filePath);
                    if (contentType == null) {
                        contentType = "application/octet-stream";
                    }
                } catch (IOException e) {
                    // Fallback to manual detection
                    String fileExtension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
                    contentType = getContentTypeByExtension(fileExtension);
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + getOriginalFilename(filename) + "\"")
                        .body(resource);
            } else {
                System.err.println("File not found or not readable: " + filePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            System.err.println("Malformed URL: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/view/{type}/{filename:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String type, @PathVariable String filename) {
        try {
            // Construct file path based on type (task, response, application, or document)
            String folderName = type + "s";
            Path filePath = Paths.get(uploadDir).resolve(folderName).resolve(filename).normalize();
            
            System.out.println("Looking for file to view at: " + filePath.toAbsolutePath());
            
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Determine content type for inline viewing
                String contentType = "application/octet-stream";
                
                try {
                    contentType = Files.probeContentType(filePath);
                    if (contentType == null) {
                        String fileExtension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
                        contentType = getContentTypeByExtension(fileExtension);
                    }
                } catch (IOException e) {
                    String fileExtension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
                    contentType = getContentTypeByExtension(fileExtension);
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + getOriginalFilename(filename) + "\"")
                        .body(resource);
            } else {
                System.err.println("File not found or not readable for viewing: " + filePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            System.err.println("Malformed URL for viewing: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    private String getContentTypeByExtension(String fileExtension) {
        switch (fileExtension.toLowerCase()) {
            case "pdf":
                return "application/pdf";
            case "doc":
                return "application/msword";
            case "docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "txt":
                return "text/plain";
            case "zip":
                return "application/zip";
            case "rar":
                return "application/x-rar-compressed";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "csv":
                return "text/csv";
            case "ppt":
                return "application/vnd.ms-powerpoint";
            case "pptx":
                return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            default:
                return "application/octet-stream";
        }
    }

    private String getOriginalFilename(String storedFilename) {
        // Remove timestamp from filename for display
        if (storedFilename.contains("_") && storedFilename.matches(".*_\\d+\\..*")) {
            int lastUnderscore = storedFilename.lastIndexOf("_");
            String beforeTimestamp = storedFilename.substring(0, lastUnderscore);
            String extension = storedFilename.substring(storedFilename.lastIndexOf("."));
            return beforeTimestamp.replace("_", " ") + extension;
        }
        return storedFilename.replace("_", " ");
    }

    // Debug endpoint to list files
    @GetMapping("/debug/list/{type}")
    public ResponseEntity<?> listFiles(@PathVariable String type) {
        try {
            Path dirPath = Paths.get(uploadDir).resolve(type + "s");
            if (Files.exists(dirPath)) {
                return ResponseEntity.ok(Files.list(dirPath)
                    .map(path -> path.getFileName().toString())
                    .toArray());
            } else {
                return ResponseEntity.ok("Directory does not exist: " + dirPath.toAbsolutePath());
            }
        } catch (IOException e) {
            return ResponseEntity.ok("Error listing files: " + e.getMessage());
        }
    }
}
