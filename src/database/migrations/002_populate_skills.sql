-- Migration to populate initial skills and categories
-- Created: 2024-03-19

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Begin transaction
BEGIN TRANSACTION;

-- Insert categories
INSERT INTO categories (name) VALUES
    ('General Professional Skills'),
    ('Certifications'),
    ('Specialized Industries'),
    ('Operations'),
    ('Human Resources'),
    ('Business & Finance'),
    ('Content Creation'),
    ('Project Management'),
    ('Digital Marketing'),
    ('Design'),
    ('Cybersecurity'),
    ('Cloud Computing'),
    ('Data Science & Analytics'),
    ('Software Development'),
    ('Uncategorized');

-- Insert skills (this is a subset of the most important skills, you can add more as needed)
INSERT INTO skills (id, name, category_id) VALUES
    -- Software Development
    ('s1', 'JavaScript', (SELECT id FROM categories WHERE name = 'Software Development')),
    ('s2', 'Python', (SELECT id FROM categories WHERE name = 'Software Development')),
    ('s3', 'Java', (SELECT id FROM categories WHERE name = 'Software Development')),
    ('s4', 'React', (SELECT id FROM categories WHERE name = 'Software Development')),
    ('s5', 'Node.js', (SELECT id FROM categories WHERE name = 'Software Development')),
    ('s6', 'TypeScript', (SELECT id FROM categories WHERE name = 'Software Development')),
    ('s7', 'AWS', (SELECT id FROM categories WHERE name = 'Software Development')),
    ('s8', 'Microservices', (SELECT id FROM categories WHERE name = 'Software Development')),
    ('s9', 'CI/CD', (SELECT id FROM categories WHERE name = 'Software Development')),
    ('s10', 'Test Automation', (SELECT id FROM categories WHERE name = 'Software Development')),

    -- Data Science & Analytics
    ('s11', 'Machine Learning', (SELECT id FROM categories WHERE name = 'Data Science & Analytics')),
    ('s12', 'TensorFlow', (SELECT id FROM categories WHERE name = 'Data Science & Analytics')),
    ('s13', 'SQL', (SELECT id FROM categories WHERE name = 'Data Science & Analytics')),
    ('s14', 'Data Analysis', (SELECT id FROM categories WHERE name = 'Data Science & Analytics')),
    ('s15', 'Big Data', (SELECT id FROM categories WHERE name = 'Data Science & Analytics')),
    ('s16', 'Data Visualization', (SELECT id FROM categories WHERE name = 'Data Science & Analytics')),
    ('s17', 'Statistical Analysis', (SELECT id FROM categories WHERE name = 'Data Science & Analytics')),

    -- Design
    ('s18', 'UI Design', (SELECT id FROM categories WHERE name = 'Design')),
    ('s19', 'UX Design', (SELECT id FROM categories WHERE name = 'Design')),
    ('s20', 'Figma', (SELECT id FROM categories WHERE name = 'Design')),
    ('s21', 'Prototyping', (SELECT id FROM categories WHERE name = 'Design')),
    ('s22', 'User Research', (SELECT id FROM categories WHERE name = 'Design')),
    ('s23', 'Design Systems', (SELECT id FROM categories WHERE name = 'Design')),
    ('s24', 'Information Architecture', (SELECT id FROM categories WHERE name = 'Design')),
    ('s25', 'Visual Design', (SELECT id FROM categories WHERE name = 'Design')),

    -- Project Management
    ('s26', 'Project Management', (SELECT id FROM categories WHERE name = 'Project Management')),
    ('s27', 'Agile Methodology', (SELECT id FROM categories WHERE name = 'Project Management')),
    ('s28', 'Scrum', (SELECT id FROM categories WHERE name = 'Project Management')),
    ('s29', 'Risk Management', (SELECT id FROM categories WHERE name = 'Project Management')),
    ('s30', 'Resource Allocation', (SELECT id FROM categories WHERE name = 'Project Management')),
    ('s31', 'Stakeholder Management', (SELECT id FROM categories WHERE name = 'Project Management')),
    ('s32', 'Budget Management', (SELECT id FROM categories WHERE name = 'Project Management')),
    ('s33', 'JIRA', (SELECT id FROM categories WHERE name = 'Project Management')),

    -- Business & Finance
    ('s34', 'Business Strategy', (SELECT id FROM categories WHERE name = 'Business & Finance')),
    ('s35', 'Financial Analysis', (SELECT id FROM categories WHERE name = 'Business & Finance')),
    ('s36', 'Market Research', (SELECT id FROM categories WHERE name = 'Business & Finance')),
    ('s37', 'Strategic Planning', (SELECT id FROM categories WHERE name = 'Business & Finance')),
    ('s38', 'Business Development', (SELECT id FROM categories WHERE name = 'Business & Finance')),
    ('s39', 'Competitive Analysis', (SELECT id FROM categories WHERE name = 'Business & Finance')),
    ('s40', 'Process Improvement', (SELECT id FROM categories WHERE name = 'Business & Finance')),
    ('s41', 'Salesforce', (SELECT id FROM categories WHERE name = 'Business & Finance')),

    -- General Professional Skills
    ('s42', 'Communication', (SELECT id FROM categories WHERE name = 'General Professional Skills')),
    ('s43', 'Leadership', (SELECT id FROM categories WHERE name = 'General Professional Skills')),
    ('s44', 'Team Management', (SELECT id FROM categories WHERE name = 'General Professional Skills')),
    ('s45', 'Problem-Solving', (SELECT id FROM categories WHERE name = 'General Professional Skills')),
    ('s46', 'Critical Thinking', (SELECT id FROM categories WHERE name = 'General Professional Skills')),
    ('s47', 'Decision Making', (SELECT id FROM categories WHERE name = 'General Professional Skills')),
    ('s48', 'Time Management', (SELECT id FROM categories WHERE name = 'General Professional Skills')),
    ('s49', 'Prioritization', (SELECT id FROM categories WHERE name = 'General Professional Skills')),
    ('s50', 'Public Speaking', (SELECT id FROM categories WHERE name = 'General Professional Skills'));

-- Commit transaction
COMMIT; 