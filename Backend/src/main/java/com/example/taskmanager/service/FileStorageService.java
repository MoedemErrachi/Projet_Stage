package com.example.taskmanager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;


@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String storeFile(MultipartFile file, String subDirectory) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, subDirectory + "s"); // tasks or responses
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Keep original filename but make it URL-safe
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "file";
        }
        
        // Replace spaces and special characters to make filename URL-safe
        String safeFilename = originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
        
        // Add timestamp to avoid conflicts
        String timestamp = String.valueOf(System.currentTimeMillis());
        String fileExtension = "";
        if (safeFilename.contains(".")) {
            fileExtension = safeFilename.substring(safeFilename.lastIndexOf("."));
            safeFilename = safeFilename.substring(0, safeFilename.lastIndexOf("."));
        }
        
        String uniqueFilename = safeFilename + "_" + timestamp + fileExtension;

        // Store file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("File stored at: " + filePath.toAbsolutePath());
        return uniqueFilename; // Return just the filename
    }

    public void deleteFile(String fileName, String subDirectory) {
        try {
            Path path = Paths.get(uploadDir, subDirectory + "s", fileName);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Could not delete file: " + fileName);
        }
    }
}
