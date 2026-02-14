import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Report title is required"],
    },
    type: {
      type: String,
      required: [true, "Report type is required"],
      enum: {
        values: [
          "SALES", "INVENTORY", "FINANCIAL", "CUSTOMER", 
          "PRESCRIPTION", "STAFF", "AUDIT", "CUSTOM"
        ],
        message: "Report type must be one of the predefined values",
      },
    },
    description: String,
    parameters: {
      dateRange: {
        start: Date,
        end: Date,
      },
      filters: Schema.Types.Mixed, // Dynamic filters based on report type
      groupBy: String,
      sortBy: String,
      limit: Number,
    },
    format: {
      type: String,
      enum: {
        values: ["PDF", "CSV", "EXCEL", "JSON", "HTML"],
        message: "Format must be one of the predefined values",
      },
      default: "PDF",
    },
    schedule: {
      isScheduled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "ANNUALLY"],
      },
      nextRunDate: Date,
      recipients: [{
        email: String,
      }],
    },
    lastGeneratedAt: Date,
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    fileUrl: String, // URL to the generated report file
    isTemplate: {
      type: Boolean,
      default: false,
    },
    visualizations: [{
      type: {
        type: String,
        enum: ["BAR", "LINE", "PIE", "TABLE", "GAUGE", "SUMMARY"],
      },
      title: String,
      dataSource: {
        collection: String, // MongoDB collection name
        aggregation: Schema.Types.Mixed, // Aggregation pipeline
      },
      options: Schema.Types.Mixed, // Visualization-specific options
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Analytical view model for predefined data aggregations
const analyticalViewModel = new Schema(
  {
    name: {
      type: String,
      required: [true, "View name is required"],
      unique: true,
    },
    description: String,
    query: {
      type: Schema.Types.Mixed, // MongoDB aggregation pipeline
      required: [true, "Query definition is required"],
    },
    refreshFrequency: {
      type: String,
      enum: {
        values: ["REALTIME", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "MANUAL"],
        message: "Refresh frequency must be one of the predefined values",
      },
      default: "DAILY",
    },
    lastRefreshed: Date,
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "PAUSED", "ERROR"],
        message: "Status must be one of the predefined values",
      },
      default: "ACTIVE",
    },
    accessRoles: [{
      type: String,
      enum: ["ADMIN", "MANAGER", "PHARMACIST", "CASHIER", "STAFF"],
    }],
    tags: [String],
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// KPI tracking model
const kpiSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "KPI name is required"],
      unique: true,
    },
    description: String,
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["FINANCIAL", "OPERATIONAL", "CUSTOMER", "EMPLOYEE", "REGULATORY"],
        message: "Category must be one of the predefined values",
      },
    },
    calculation: {
      formula: String, // Description of how the KPI is calculated
      source: {
        collection: String,
        aggregation: Schema.Types.Mixed,
      },
    },
    target: {
      value: Number,
      unit: String,
    },
    actual: {
      value: Number,
      lastUpdated: Date,
    },
    trend: [{
      date: Date,
      value: Number,
    }],
    visualSettings: {
      thresholds: {
        warning: Number,
        critical: Number,
      },
      displayType: {
        type: String,
        enum: ["NUMBER", "PERCENTAGE", "CURRENCY", "TIME"],
        default: "NUMBER",
      },
      colorScheme: {
        good: String, // Hex color code
        warning: String,
        critical: String,
      },
    },
    frequency: {
      type: String,
      enum: ["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "ANNUALLY"],
      default: "MONTHLY",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Forecasting model
const forecastSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Forecast name is required"],
    },
    type: {
      type: String,
      enum: {
        values: ["SALES", "INVENTORY", "EXPENSES", "REVENUE", "CUSTOMER"],
        message: "Type must be one of the predefined values",
      },
      required: [true, "Forecast type is required"],
    },
    targetEntity: {
      entityType: {
        type: String,
        enum: ["DRUG", "CATEGORY", "STORE", "TOTAL", "OTHER"],
        required: [true, "Target entity type is required"],
      },
      entityId: Schema.Types.ObjectId,
    },
    parameters: {
      period: {
        type: String,
        enum: ["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "ANNUALLY"],
        required: [true, "Forecast period is required"],
      },
      horizon: {
        type: Number, // Number of periods to forecast
        required: [true, "Forecast horizon is required"],
        min: [1, "Horizon must be at least 1"],
      },
      confidenceLevel: {
        type: Number,
        min: [0, "Confidence level cannot be negative"],
        max: [100, "Confidence level cannot exceed 100"],
        default: 95,
      },
      seasonality: Boolean,
      historicalPeriods: Number, // How many historical periods to use
    },
    results: [{
      period: Date, // The forecasted period
      forecast: Number, // The forecasted value
      lowerBound: Number, // Lower confidence bound
      upperBound: Number, // Upper confidence bound
      actualValue: Number, // Filled in after the period ends
    }],
    accuracy: {
      mae: Number, // Mean Absolute Error
      mape: Number, // Mean Absolute Percentage Error
      lastUpdated: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Export all schemas
export const Report = mongoose.model("reports", reportSchema);
export const AnalyticalView = mongoose.model("analyticalViews", analyticalViewModel);
export const KPI = mongoose.model("kpis", kpiSchema);
export const Forecast = mongoose.model("forecasts", forecastSchema);
