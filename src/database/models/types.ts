export interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Profile {
    id: string;
    name: string;
    title?: string;
    department?: string;
    bio?: string;
    image?: string;
    hourly_rate?: number;
    day_rate?: number;
    yearly_salary?: number;
    created_at: string;
    updated_at: string;
}

export interface ContactInfo {
    id: number;
    profile_id: string;
    email?: string;
    phone?: string;
    website?: string;
    location?: string;
    created_at: string;
    updated_at: string;
}

export interface SocialMedia {
    id: number;
    contact_id: number;
    platform: string;
    url?: string;
    created_at: string;
    updated_at: string;
}

export interface Skill {
    id: string;
    name: string;
    category_id?: number;
    created_at: string;
    updated_at: string;
}

export interface ProfileSkill {
    profile_id: string;
    skill_id: string;
    proficiency: string;
    created_at: string;
    updated_at: string;
}

export interface Availability {
    id: number;
    profile_id: string;
    status: string;
    available_from?: string;
    next_available?: string;
    preferred_hours?: string;
    timezone?: string;
    booking_lead_time?: number;
    weekly_hours?: number;
    max_concurrent_projects?: number;
    preferred_project_duration_min?: number;
    preferred_project_duration_max?: number;
    created_at: string;
    updated_at: string;
}

export interface CurrentCommitment {
    id: number;
    availability_id: number;
    project_id?: string;
    project_name?: string;
    role?: string;
    start_date?: string;
    end_date?: string;
    commitment_percentage?: number;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface SeasonalAvailability {
    id: number;
    availability_id: number;
    start_date: string;
    end_date: string;
    status?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Education {
    id: number;
    profile_id: string;
    institution: string;
    degree?: string;
    field?: string;
    start_date?: string;
    end_date?: string;
    created_at: string;
    updated_at: string;
}

export interface Certification {
    id: number;
    profile_id: string;
    name: string;
    issuer?: string;
    date?: string;
    created_at: string;
    updated_at: string;
} 