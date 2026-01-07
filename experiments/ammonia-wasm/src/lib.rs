use wasm_bindgen::prelude::*;

/// Clean HTML using ammonia with default settings
#[wasm_bindgen]
pub fn clean(html: &str) -> String {
    ammonia::clean(html)
}

/// Clean HTML with custom allowed tags
#[wasm_bindgen]
pub fn clean_with_tags(html: &str, allowed_tags: Vec<String>) -> String {
    use std::collections::HashSet;

    let mut builder = ammonia::Builder::default();

    // Convert Vec<String> to HashSet<&str>
    let tag_set: HashSet<&str> = allowed_tags.iter().map(|s| s.as_str()).collect();
    builder.tags(tag_set);

    builder.clean(html).to_string()
}

/// Check if HTML is safe (identical after sanitization)
#[wasm_bindgen]
pub fn is_safe(html: &str) -> bool {
    let sanitized = ammonia::clean(html);
    sanitized == html
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_clean_removes_script() {
        let dirty = r#"<p>Hello</p><script>alert("xss")</script>"#;
        let clean_html = clean(dirty);
        assert_eq!(clean_html, "<p>Hello</p>");
        assert!(!clean_html.contains("script"));
    }

    #[test]
    fn test_is_safe() {
        assert!(is_safe("<p>Hello</p>"));
        assert!(!is_safe(r#"<p>Hello</p><script>alert("xss")</script>"#));
    }

    #[test]
    fn test_clean_with_tags() {
        let html = "<p>Hello</p><div>World</div>";
        let sanitized = clean_with_tags(html, vec!["p".to_string()]);
        assert!(sanitized.contains("<p>Hello</p>"));
        assert!(!sanitized.contains("<div>"));
    }
}
