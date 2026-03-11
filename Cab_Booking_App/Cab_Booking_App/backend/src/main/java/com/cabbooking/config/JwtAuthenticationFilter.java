package com.cabbooking.config;

import com.cabbooking.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/api/auth/") || path.startsWith("/ws-cab") || path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs");
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        String requestUri = request.getRequestURI();
        log.info("Incoming request: {} {} (servletPath: {})", request.getMethod(), requestUri, servletPath);
        
        final String authHeader = request.getHeader("Authorization");
        log.debug("Authorization header: {}", authHeader);
        final String jwt;
        final String userEmail;

        if (request.getServletPath().contains("/api/ratings/")) {
            log.info("Request to ratings endpoint. Authorization header: {}", authHeader);
            java.util.Collections.list(request.getHeaderNames()).forEach(name -> 
                log.debug("Header {}: {}", name, request.getHeader(name))
            );
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("No Bearer token found for path: {}", request.getServletPath());
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            userEmail = jwtUtil.extractUsername(jwt);
            log.debug("Extracted user: {} from token", userEmail);
        } catch (Exception e) {
            log.error("Failed to extract username from token: {}", e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if (jwtUtil.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.debug("Successfully authenticated user: {}", userEmail);
            } else {
                log.warn("Token validation failed for user: {} on path: {}", userEmail, request.getServletPath());
            }
        } else if (userEmail == null) {
            log.warn("User email could not be extracted from token for path: {}", request.getServletPath());
        }
        filterChain.doFilter(request, response);
    }
}
