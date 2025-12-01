// Server types

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type MediaType = 'IMAGE' | 'VIDEO';

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface ExerciseMedia {
  media_type: MediaType;
  url: string;
  order: number;
  alt_text: string;
}

export interface Exercise {
  id: number;
  name: string;
  slug: string;
  summary: string;
  instructions_md: string;
  unit_type: string;
  default_sets: number;
  default_reps_or_seconds: number;
  default_rest_sec: number;
  equipment: string;
  media: ExerciseMedia[];
}

export interface WorkoutCard {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  hero_image: string;
  difficulty: Difficulty;
  genres: Genre[];
  percent_complete: number;
}

export type StepKind = 'EXERCISE' | 'REST' | 'NOTE';

export interface StepExercise {
  kind: 'EXERCISE';
  id: number;
  order: number;
  exercise: Exercise;
  sets: number;
  reps_or_seconds: number;
  rest_between_sets_sec?: number | null;
  tempo: string;
  camera_required: boolean;
}

export interface StepRest {
  kind: 'REST';
  id: number;
  order: number;
  rest_duration_sec: number;
  rest_message: string;
}

export interface StepNote {
  kind: 'NOTE';
  id: number;
  order: number;
  note_title: string;
  note_body_md: string;
}

export type Step = StepExercise | StepRest | StepNote;

export interface WorkoutDetail {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  hero_image: string;
  difficulty: Difficulty;
  genres: Genre[];
  steps: Step[];
  percent_complete: number;
}

export interface Session {
  id: number;
  workout_id: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  current_step_order: number;
  current_set_index: number;
  percent_complete: number;
}

export type SessionEventType = 'complete_set' | 'start_rest' | 'end_rest' | 'skip_step';

export interface SessionEvent {
  type: SessionEventType;
  workout_step_id?: number;
  set_index?: number;
  reps_done?: number;
  seconds_done?: number;
}

