# Quick TypeScript Fixes for Schema Mapping

Based on the compilation errors, here are the key schema differences that need to be addressed:

## Schema Field Mappings Required

### Project Model Mapping
```typescript
// Current Schema -> Implementation Mapping
name -> companyName/projectName
logoUrl -> companyLogo/projectLogo  
bannerUrl -> companyBanner/projectBanner
// Missing fields that need defaults:
// - companyBio (use description)
// - companyLocation (use empty string or add to schema)
// - blockchainFocus (use developmentFocus or add to schema)
```

### Tag Model Mapping
```typescript
// Current Schema -> Implementation Mapping  
tags.tag -> tags.name (field name is 'tag' not 'name')
```

### User Model Mapping
```typescript
// Missing field in schema:
// - location (needs to be added or use empty string)
```

### Partnership Model Mapping
```typescript
// Missing fields that need to be added:
// - duration, equity, compensation (optional fields)
```

### Message Model Mapping
```typescript
// Missing field:
// - attachmentUrl (for future file attachments)
```

### Missing Includes
Many queries assume `include` relationships that aren't specified.

## Immediate Fix Strategy

Instead of major schema changes, map existing fields to expected format in services.