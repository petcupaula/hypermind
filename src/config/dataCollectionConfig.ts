
export interface DataCollectionConfig {
  type: string;
  description: string;
  evaluate: (value: boolean | number | null) => {
    isGood: boolean;
    description: string;
  };
}

const dataCollectionConfig: Record<string, DataCollectionConfig> = {
  talk_listen_ratio: {
    type: "number",
    description: "The ratio between talking and listening time",
    evaluate: (value) => {
      if (value === null) return { isGood: false, description: "Not collected" };
      const ratio = value as number;
      return {
        isGood: ratio >= 0.8 && ratio <= 1.3,
        description: ratio >= 0.8 && ratio <= 1.3
          ? "Good balance between talking and listening"
          : ratio < 0.8
            ? "Too much listening compared to talking"
            : "Too much talking compared to listening"
      };
    }
  },
  next_steps: {
    type: "boolean",
    description: "Whether next steps were discussed",
    evaluate: (value) => ({
      isGood: value === true,
      description: value === true
        ? "Successfully discussed next steps"
        : value === false
          ? "Failed to discuss next steps"
          : "Not collected"
    })
  },
  social_proof: {
    type: "boolean",
    description: "Whether social proof was provided",
    evaluate: (value) => ({
      isGood: value === true,
      description: value === true
        ? "Successfully provided social proof"
        : value === false
          ? "Failed to provide social proof"
          : "Not collected"
    })
  },
  question_preconception: {
    type: "boolean",
    description: "Whether preconceptions were questioned",
    evaluate: (value) => ({
      isGood: value === true,
      description: value === true
        ? "Successfully questioned preconceptions"
        : value === false
          ? "Failed to question preconceptions"
          : "Not collected"
    })
  },
  permission: {
    type: "boolean",
    description: "Whether permission was obtained",
    evaluate: (value) => ({
      isGood: value === true,
      description: value === true
        ? "Permission was successfully obtained"
        : value === false
          ? "Failed to obtain permission"
          : "Not collected"
    })
  },
  manipulative: {
    type: "boolean",
    description: "Whether manipulative behavior was detected",
    evaluate: (value) => ({
      isGood: value === false,
      description: value === true
        ? "Manipulative behavior detected"
        : value === false
          ? "No manipulative behavior detected"
          : "Not collected"
    })
  }
};

export default dataCollectionConfig;
