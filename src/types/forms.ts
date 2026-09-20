export interface FormSettings {
  heroFormTitle: string;
  heroFormSubtitle: string;
  heroFormButtonText: string;
  heroFormSuccessTitle: string;
  heroFormSuccessMessage: string;

  applyModalTitle: string;
  applyModalSubtitle: string;
  applyModalButtonText: string;
  applyModalSuccessTitle: string;
  applyModalSuccessMessage: string;

  curriculumModalTitle: string;
  curriculumModalSubtitle: string;
  curriculumModalButtonText: string;
}

export const defaultFormSettings: FormSettings = {
  heroFormTitle: "Fast Track Application",
  heroFormSubtitle: "Live cohort starts soon · Limited seats",
  heroFormButtonText: "Apply for Batch 2",
  heroFormSuccessTitle: "Submitted",
  heroFormSuccessMessage: "Thank you! Your details have been received successfully.",

  applyModalTitle: "Apply for Batch 2",
  applyModalSubtitle: "Leave with work you can show in an interview, not a certificate.",
  applyModalButtonText: "Submit Application",
  applyModalSuccessTitle: "Submitted",
  applyModalSuccessMessage: "Thank you! Your details have been received successfully.",

  curriculumModalTitle: "Download Curriculum",
  curriculumModalSubtitle: "Get the full week-by-week phase roadmap, deliverables & toolstack.",
  curriculumModalButtonText: "Download Syllabus Now",
};
