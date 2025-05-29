# TalentDeck CSV Export/Import Format

## Overview

TalentDeck supports exporting and importing talent profiles in CSV format. This format preserves all profile data including nested structures like skills, education, and contact information.

## CSV Structure

### Basic Fields
- `id` - Unique profile identifier
- `name` - Full name of the talent
- `department` - Department/division
- `title` - Job title/role
- `bio` - Short biography
- `about` - Detailed description
- `location` - Geographic location
- `yearsOfExperience` - Years of experience (numeric)

### Contact Information
- `email` - Primary email address
- `phone` - Phone number
- `website` - Personal/professional website
- `contactLocation` - Contact location (may differ from main location)

### Social Profiles
- `linkedin` - LinkedIn profile URL
- `twitter` - Twitter/X profile URL
- `facebook` - Facebook profile URL
- `instagram` - Instagram profile URL
- `github` - GitHub profile URL
- `youtube` - YouTube channel URL

### Rate Information
- `hourlyRate` - Hourly rate (numeric)
- `dayRate` - Daily rate (numeric)
- `yearlySalary` - Annual salary (numeric)
- `weeklyProjectRate` - Weekly project rate
- `monthlyProjectRate` - Monthly project rate
- `quarterlyProjectRate` - Quarterly project rate
- `yearlyProjectRate` - Yearly project rate
- `minimumProjectDuration` - Minimum project duration in days
- `maximumProjectDuration` - Maximum project duration in days
- `projectDiscountPercentage` - Discount for longer projects

### Availability
- `availabilityStatus` - Current availability status
- `availableFrom` - Date available from
- `nextAvailable` - Next available date
- `preferredHours` - Preferred working hours
- `timezone` - Timezone
- `bookingLeadTime` - Required booking lead time
- `weeklyHours` - Available weekly hours
- `maxConcurrentProjects` - Maximum concurrent projects
- `preferredProjectDurationMin` - Preferred minimum project duration
- `preferredProjectDurationMax` - Preferred maximum project duration

### Complex Fields (Pipe-Separated)

#### Skills
Format: `name:category:proficiency|name:category:proficiency|...`
- Each skill is separated by `|`
- Within each skill: `name:category:proficiency`
- Example: `JavaScript:Programming:Expert|React:Frontend:Advanced|Node.js:Backend:Intermediate`

#### Tags
Format: `tag1|tag2|tag3|...`
- Simple pipe-separated list
- Example: `remote|full-time|senior|tech-lead`

#### Education
Format: `institution:degree:field:startDate:endDate|institution:degree:field:startDate:endDate|...`
- Each education entry separated by `|`
- Within each entry: `institution:degree:field:startDate:endDate`
- Example: `MIT:Bachelor:Computer Science:2015:2019|Stanford:Master:AI:2019:2021`

#### Certifications
Format: `name:issuer:date:expiryDate|name:issuer:date:expiryDate|...`
- Each certification separated by `|`
- Within each entry: `name:issuer:date:expiryDate`
- Empty expiry date is allowed
- Example: `AWS Certified:Amazon:2023-01-15:|React Certified:Meta:2023-03-20:2025-03-20`

## Export Options

### From the UI
1. **Export Visible** - Exports all currently displayed profiles (filtered results)
2. **Export Selected** - Exports only selected profiles (when selection feature is available)

### Via API
- `GET /api/profiles/export` - Export all profiles
- `GET /api/profiles/export?ids=id1,id2,id3` - Export specific profiles
- `GET /api/profiles/export?format=csv` - Specify CSV format

## Import Guidelines

### Data Validation
- All required fields must be present: `name`, `department`, `title`, `email`, `phone`
- Numeric fields will be converted automatically
- Invalid proficiency levels default to "Intermediate"
- Malformed complex fields will be skipped with warning

### ID Handling
- If `id` is provided and exists, the profile will be updated
- If `id` is empty or doesn't exist, a new profile will be created
- Leave `id` empty for bulk imports of new profiles

### Best Practices
1. **Data Backup** - Always backup existing data before importing
2. **Test Import** - Test with a small subset first
3. **Data Validation** - Validate your CSV format before importing
4. **Encoding** - Use UTF-8 encoding for special characters
5. **Line Endings** - Use standard line endings (LF or CRLF)

## Example CSV

```csv
id,name,department,title,email,phone,skills,tags
,John Doe,Engineering,Senior Developer,john@example.com,+1234567890,"JavaScript:Programming:Expert|React:Frontend:Advanced","remote|senior|tech-lead"
,Jane Smith,Design,UX Designer,jane@example.com,+1234567891,"Figma:Design:Expert|Sketch:Design:Advanced","remote|design|ux"
```

## Error Handling

Common import errors and solutions:

1. **Missing Required Fields** - Ensure all required fields are present
2. **Invalid Date Formats** - Use ISO date format (YYYY-MM-DD)
3. **Malformed Complex Fields** - Check pipe and colon separators
4. **Encoding Issues** - Save CSV as UTF-8
5. **Large Files** - Break large imports into smaller batches

## File Naming Convention

Exported files follow this pattern:
- `talent-profiles-filtered-YYYY-MM-DD.csv` - Filtered results
- `talent-profiles-selected-YYYY-MM-DD.csv` - Selected profiles
- `talent-profiles-YYYY-MM-DD.csv` - API exports

Where `YYYY-MM-DD` is the export date. 