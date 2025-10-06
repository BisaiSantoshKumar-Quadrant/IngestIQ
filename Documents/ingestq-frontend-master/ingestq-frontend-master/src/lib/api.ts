
const BASE_URL = "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com";

export interface RegisterData {
    full_name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        user_id(arg0: string, user_id: any): unknown;
        username: any;
        email: string;
        created_at: string;
        is_active: boolean;
    };
}

export interface Bucket {
    name: string;
}

export interface Object {
    key: string;
    isFolder?: boolean;
}

export interface SchemaAnalysisRequest {
  bucket_name: string;
  key: string;
}

export interface SchemaAnalysisResponse {
  success: boolean;
  message: string;
  lambda_response?: {
    statusCode?: number;
    message?: string;
    error?: string;
    results?: {
      [sheetName: string]: {
        Samples: any;
        Nullable: any;
        PreviousSchema: Record<string, string>;  // columnName -> type
        CurrentSchema: Record<string, string>;   // columnName -> type
        Changes: {
          NewColumn_names: string[];
          MissingColumn_names: string[];
          Suggestion?: string;
        };
      };
    };
  };
}

export interface PreviewDataRequest {
  bucket_name: string;
  key: string;
}

export interface PreviewDataResponse {
  success: boolean;
  data?: {
    columns: string[];
    rows: Record<string, any>[];
  };
}

export interface RelationshipRequest {
  bucket_name: string;
  key: string;
}

export interface RelationshipResponse {
  success: boolean;
  relationships?: {
    map(arg0: (r: any) => any): unknown;
    find(arg0: (r: any) => boolean): unknown;
    column: string;
    file1: string;
    file2: string;
  };
}

export interface DQRulesGenerationRequest {
  input_type: string; // e.g. "csv"
  bucket: string;
  key: string;
}

export interface DQRule {
  rule: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface DQRulesGenerationResponse {
  success: boolean;
  message: string;
  lambda_response?: {
    statusCode?: number;
    body?: {
      file: DQRule[];
    };
  };
}

export interface DQValidationRequest {
  csv_file_path: string;
  rules: DQRule[];
}

export interface DQValidationResponse {
  rules_failed: number;
  rules_passed: number;
  issues: {
    [ruleName: string]: {
      rule: string;
      reason_for_failure: string;
      proposed_solution: string;
    };
  };
  proposed_solutions: { [ruleName: string]: string };
}

export interface DQFixingRequest {
  csv_file_path: string;
  rules: DQRule[];
  proposed_solutions: { [ruleName: string]: string };
}

export interface FixedRecord {
  [key: string]: string | number | null;
}

export type DQFixingResponse = FixedRecord[];

export interface ResolveEntitiesRequest {
  bucket: string;
  key: string;
  temp_output_key: string;
}

export interface ResolvedEntity {
  type: string;
  Name: string;
  "Resolved name": string;
  Confidence: string;
}

export interface ResolveEntitiesResponse {
  status: string;
  message: string;
  resolutions?: ResolvedEntity[]; // <-- updated to match API response
}

export interface ChooseApplyRequest {
  bucket: string;
  key: string;
  chosen: ResolvedEntity[];
}

export interface ChooseApplyResponse {
  status: string;
  message: string;
}

export interface BLValidationRequest {
  payload: {
    input: {
      input_type: string; // e.g. "file"
      Records: {
        s3: {
          bucket: { name: string };
          object: { key: string };
        };
      }[];
    };
    rules: {
      [ruleName: string]: string; // dynamic rules
    };
  };
}

export interface BLValidationResponse {
  statusCode: number;
  body: {
    statusCode: number;
    passed_rules: number;
    failed_rules: number;
    details: {
      [ruleName: string]: {
        passed_count: number;
        failed_count: number;
      };
    };
  };
}

// export interface ETLRequest {
//   payload: {
//     file_paths: {
//       [filePath: string]: {
//         output_path: string;
//       };
//     };
//   };
// }

// export interface ETLResponse {
//   statusCode: number;
//   body: {
//     statusCode: number;
//     body: string; // e.g. "{\"etl_method\": \"Glue\"}"
//   };
// }

export interface ETLRequest {
  payload: {
    file_paths: {
      [filePath: string]: {
        output_path: string;
      };
    };
    gname: string;
    glue_script_path?: string; // optional for custom glue scripts
  };
}

export interface ETLResponse {
  statusCode: number;
  body: {
    statusCode: number;
    body: string; // e.g. "{\"etl_method\": \"Glue\"}"
  };
}



// // Create Job Config Types
// export interface JobStepConfig {
//   rules: "executed" | "skipped";
//   ner: "executed" | "skipped";
//   businessLogic: "executed" | "skipped";
//   datatransformations:"executed"|"skipped";
// }

// export interface ScheduleDetails {
//   frequency?: string; // e.g., "daily"
//   time?: string;      // e.g., "10:23"
// }

// export interface CreateJobConfigRequest {
//   jobName: string;
//   triggerType: "SCHEDULE" | "File";
//   steps: JobStepConfig;
//   datasource: string;         // e.g., "s3://bucket/key.csv"
//   datadestination: string;    // e.g., "Azure"
//   scheduleDetails?: ScheduleDetails;
//    job_type?: string;          // optional
//   glue_name?: string;         // optional
// }

// export interface JobConfigResponse {
//   success: boolean;
//   message: string;
//   job: {
//     jobId: string;
//     user_id: string;
//     email: string;
//     jobName: string;
//     triggerType: string;
//     steps: JobStepConfig;
//     datasource: string;
//     datadestination: string;
//     scheduleDetails: ScheduleDetails | {};
//     createdAt: string;
//     BucketName: string;
//     FolderName: string;
//     FileName: string;
//     Status: string;
//     LastRun: string;
//     etag: string;
//     job_type?: string;       // optional
//     glue_name?: string;      // optional
//   };
// }

// Job type
export interface Job {
  glueName: string;
  jobType: string;
  business_logic_rules: Record<string, string>;
  stages: any[];
  category: string;
  name: string;
  description: string;
  pipelines: any;
  isConnected: any;
  FolderName: string;
  datadestination: string;
  createdAt: string;
  jobId: string;
  triggerType: "SCHEDULE" | "File";
  Status: string;
  etag: string;
  email: string;
  FileName: string;
  scheduleDetails: ScheduleDetails | {};
  jobName: string;
  user_id: string;
  steps: JobStepConfig ;
  BucketName: string;
  datasource: string;
  LastRun: string;
}

export interface GetJobsResponse {
  success: boolean;
  message: string;
  jobs: Job[];
}


// Helper function to get the authentication token
const getAuthToken = (): string => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("No authentication token found. Please log in.");
    }
    return token;
};


// Register API
export const registerUser = async (data: RegisterData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
    }
    return response.json();
};

// Login API
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
    }
    const result = await response.json();
    if (result.token) localStorage.setItem("authToken", result.token);
    return result;
};

// Logout API
export const logoutUser = async () => {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ token }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Logout failed");
    }
    localStorage.removeItem("authToken");
    return response.json();
};

// Get S3 Buckets API
export const getBuckets = async (): Promise<string[]> => {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/buckets`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`);
        throw new Error(`Failed to fetch buckets: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
};

// Get S3 Objects API
export const getObjects = async (bucketName: string, prefix?: string): Promise<Object[]> => {
    const token = getAuthToken();
    const url = `${BASE_URL}/buckets/${bucketName}/objects${prefix ? `?prefix=${encodeURIComponent(prefix)}` : ''}`;
    console.log(`Fetching from URL: ${url} at ${new Date().toISOString()}`);
    const response = await fetch(url, { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`);
        throw new Error(`Failed to fetch objects: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log("Raw getObjects response at", new Date().toISOString(), ":", data);
    if (data.folders && Array.isArray(data.folders) && data.files && Array.isArray(data.files)) {
        const folders = data.folders.map((folder: string) => ({ key: folder, isFolder: true }));
        const files = data.files.map((file: string) => ({ key: file, isFolder: false }));
        return [...folders, ...files];
    }
    if (Array.isArray(data)) {
        return data.map((item: any) => ({ key: item.key || item.Key || item.Name || '', isFolder: item.isFolder || item.IsFolder || item.key?.endsWith('/') || false }));
    } else if (data.Contents && Array.isArray(data.Contents)) {
        return data.Contents.map((item: any) => ({ key: item.Key || item.Name || '', isFolder: item.Key?.endsWith('/') || false }));
    } else if (data.data && Array.isArray(data.data)) {
        return data.data.map((item: any) => ({ key: item.key || item.Key || item.Name || '', isFolder: item.isFolder || item.IsFolder || item.key?.endsWith('/') || false }));
    } else if (data.items && Array.isArray(data.items)) {
        return data.items.map((item: any) => ({ key: item.key || item.Key || item.Name || '', isFolder: item.isFolder || item.IsFolder || item.key?.endsWith('/') || false }));
    }
    console.warn("Unexpected response format at", new Date().toISOString(), ":", data);
    return [];
};

// Get S3 File API
export const getFile = async (bucketName: string, key: string): Promise<Blob> => {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/buckets/${bucketName}/file?key=${encodeURIComponent(key)}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`);
        throw new Error(`Failed to fetch file: ${response.status} - ${errorText}`);
    }
    return response.blob();
};

// Get Azure Containers API
export const getAzureContainers = async (): Promise<string[]> => {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/containers`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`);
        throw new Error(`Failed to fetch Azure containers: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
};

// Get Azure Blobs API
export const getAzureBlobs = async (containerName: string, prefix?: string): Promise<Object[]> => {
    const token = getAuthToken();
    const url = `${BASE_URL}/containers/${containerName}/blobs${prefix ? `?prefix=${encodeURIComponent(prefix)}` : ''}`;
    console.log(`Fetching Azure blobs from URL: ${url} at ${new Date().toISOString()}`);
    const response = await fetch(url, { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`);
        throw new Error(`Failed to fetch Azure blobs: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log("Raw getAzureBlobs response at", new Date().toISOString(), ":", data);
    if (data.folders && Array.isArray(data.folders) && data.files && Array.isArray(data.files)) {
        const folders = data.folders.map((folder: string) => ({ key: folder, isFolder: true }));
        const files = data.files.map((file: string) => ({ key: file, isFolder: false }));
        return [...folders, ...files];
    }
    if (Array.isArray(data)) {
        return data.map((item: any) => ({ key: item.key || item.name || item.Name || '', isFolder: item.isFolder || item.IsFolder || item.key?.endsWith('/') || item.name?.endsWith('/') || false }));
    } else if (data.Contents && Array.isArray(data.Contents)) {
        return data.Contents.map((item: any) => ({ key: item.Key || item.Name || '', isFolder: item.Key?.endsWith('/') || item.Name?.endsWith('/') || false }));
    } else if (data.data && Array.isArray(data.data)) {
        return data.data.map((item: any) => ({ key: item.key || item.Key || item.Name || '', isFolder: item.isFolder || item.IsFolder || item.key?.endsWith('/') || item.Name?.endsWith('/') || false }));
    } else if (data.items && Array.isArray(data.items)) {
        return data.items.map((item: any) => ({ key: item.key || item.Key || item.Name || '', isFolder: item.isFolder || item.IsFolder || item.key?.endsWith('/') || item.Name?.endsWith('/') || false }));
    }
    console.warn("Unexpected response format at", new Date().toISOString(), ":", data);
    return [];
};

// Get Azure Blob File API
export const getAzureBlobFile = async (containerName: string, key: string): Promise<Blob> => {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/containers/${containerName}/file?blob_name=${encodeURIComponent(key)}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`);
        throw new Error(`Failed to fetch Azure blob file: ${response.status} - ${errorText}`);
    }
    return response.blob();
};

// Get all Resource Groups API
export const getResourceGroups = async (): Promise<string[]> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/resource-groups`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`);
    throw new Error(`Failed to fetch resource groups: ${response.status} - ${errorText}`);
  }

  const result: string[] = await response.json();
  console.log("✅ Get Resource Groups Response:", result);
  return result;
};

// Get ADF jobs inside a Resource Group API
export const getADFJobs = async (resourceGroup: string): Promise<string[]> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/resource-groups/${resourceGroup}/adf`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`);
    throw new Error(`Failed to fetch ADF jobs for resource group ${resourceGroup}: ${response.status} - ${errorText}`);
  }

  const result: string[] = await response.json();
  console.log(`✅ Get ADF Jobs for Resource Group (${resourceGroup}):`, result);
  return result;
};

// Get Pipelines inside an ADF Job API
export const getADFPipelines = async (
  resourceGroup: string,
  adfName: string
): Promise<string[]> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/resource-groups/${resourceGroup}/adf/${adfName}/pipelines`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`);
    throw new Error(`Failed to fetch pipelines for ADF job ${adfName} in resource group ${resourceGroup}: ${response.status} - ${errorText}`);
  }

  const result: string[] = await response.json();
  console.log(`✅ Get Pipelines for ADF Job (${adfName}) in Resource Group (${resourceGroup}):`, result);
  return result;
};

// Get all Glue Jobs API
export const getGlueJobs = async (): Promise<string[]> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/glue-jobs`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`
    );
    throw new Error(
      `Failed to fetch Glue jobs: ${response.status} - ${errorText}`
    );
  }

  const result: string[] = await response.json();
  console.log("✅ Get Glue Jobs Response:", result);
  return result;
};


// Run Schema Analysis API
export const runSchemaAnalysis = async (
  data: SchemaAnalysisRequest
): Promise<SchemaAnalysisResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/run-schema-analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to run schema analysis: ${response.status} - ${errorText}`
    );
  }

  const result = await response.json();
  console.log("✅ Schema Analysis Response:", result);
  return result;
};

// Preview Data API
export const previewData = async (
  data: PreviewDataRequest
): Promise<PreviewDataResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/previewdata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to preview data: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("✅ Preview Data Response:", result);
  return result;
};

// View Relationship API
export const viewRelationship = async (
  data: RelationshipRequest
): Promise<RelationshipResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/viewrelationship`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to view relationships: ${response.status} - ${errorText}`
    );
  }

  const result = await response.json();
  console.log("✅ View Relationship Response:", result);
  return result;
};


export const runDQRulesGeneration = async (
  data: DQRulesGenerationRequest
): Promise<DQRulesGenerationResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/run-dq-rules-generation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to run DQ rules generation: ${response.status} - ${errorText}`
    );
  }

  const result = await response.json();
  console.log("✅ DQ Rules Generation Response:", result);
  return result;
};

export const runDQValidation = async (
  data: DQValidationRequest
): Promise<DQValidationResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/run_dq_validation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to run DQ validation: ${response.status} - ${errorText}`
    );
  }

  return response.json();
};

// Run DQ Fixing API
export const runDQFixing = async (
  data: DQFixingRequest
): Promise<DQFixingResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/run_dq_fixing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to run DQ fixing: ${response.status} - ${errorText}`
    );
  }

  return response.json();
};

// Resolve Entities API
export const resolveEntities = async (
  data: ResolveEntitiesRequest
): Promise<ResolveEntitiesResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/resolve_entities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to resolve entities: ${response.status} - ${errorText}`
    );
  }

  const result: ResolveEntitiesResponse = await response.json();
  console.log("✅ Resolve Entities Response:", result);
  return result;
};

// Choose & Apply API
export const chooseApply = async (
  data: ChooseApplyRequest
): Promise<ChooseApplyResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/chooseapply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to apply chosen resolutions: ${response.status} - ${errorText}`
    );
  }

  const result: ChooseApplyResponse = await response.json();
  console.log("✅ Choose Apply Response:", result);
  return result;
};

// Run Business Logic Validation API
export const runBLValidation = async (
  data: BLValidationRequest
): Promise<BLValidationResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/invoke-bl`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to run BL validation: ${response.status} - ${errorText}`);
  }

  const result: BLValidationResponse = await response.json();
  console.log("✅ BL Validation Response:", result);
  return result;
};


// //etl api
// export const runETL = async (data: ETLRequest): Promise<ETLResponse> => {
//   const token = getAuthToken();
//   const response = await fetch(`${BASE_URL}/invoke-etl`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`Failed to invoke ETL: ${response.status} - ${errorText}`);
//   }

//   const result = await response.json();
//   console.log("✅ ETL Response:", result);
//   return result;
// };


// invoke-etl API
export const runETL = async (data: ETLRequest): Promise<ETLResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/invoke-etl`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to invoke ETL: ${response.status} - ${errorText}`);
  }

  const result: ETLResponse = await response.json();
  console.log("✅ ETL Response:", result);
  return result;
};




// // Create Job Config API
// export const createJobConfig = async (
//   data: CreateJobConfigRequest
// ): Promise<JobConfigResponse> => {
//   const token = getAuthToken();
//   const response = await fetch(`${BASE_URL}/create-job-config`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(
//       `Failed to create job config: ${response.status} - ${errorText}`
//     );
//   }

//   const result: JobConfigResponse = await response.json();
//   console.log("✅ Create Job Config Response:", result);
//   return result;
// };

// Fetch Jobs API
export const getJobs = async (): Promise<GetJobsResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/jobs`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`
    );
    throw new Error(`Failed to fetch jobs: ${response.status} - ${errorText}`);
  }

  const result: GetJobsResponse = await response.json();
  console.log("✅ Get Jobs Response:", result);
  return result;
};


// // Run Step Function API
// export interface RunStepFunctionRequest {
//   job_id: string;
//   token: string;
// }

// export interface RunStepFunctionResponse {
//   success: boolean;
//   message: string;
//   executionArn: string;
//   startDate: string;
// }


// export const runStepFunction = async (
//   data: RunStepFunctionRequest
// ): Promise<RunStepFunctionResponse> => {
//   const token = getAuthToken();
//   const response = await fetch(`${BASE_URL}/run-step-function`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(
//       `Failed to run step function: ${response.status} - ${errorText}`
//     );
//   }

//   const result: RunStepFunctionResponse = await response.json();
//   console.log("✅ Run Step Function Response:", result);
//   return result;
// };


export interface RunStepFunctionRequest {
  job_id: string;
  token: string;
  jobType?: string;
  glueName?: string;
}

export interface RunStepFunctionResponse {
  success: boolean;
  message: string;
  executionArn: string;
  startDate: string;
}

export const runStepFunction = async (
  data: RunStepFunctionRequest
): Promise<RunStepFunctionResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/run-step-function`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to run step function: ${response.status} - ${errorText}`
    );
  }

  const result: RunStepFunctionResponse = await response.json();
  console.log("✅ Run Step Function Response:", result);
  return result;
};



// Get Job Details API
export interface GetJobDetailsResponse {
  success: boolean;
  message: string;
  job: Job;
}

export const getJobDetails = async (
  jobId: string
): Promise<GetJobDetailsResponse> => {
  const token = getAuthToken();
  const url = `${BASE_URL}/get_job_details?job_id=${encodeURIComponent(jobId)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch job details: ${response.status} - ${errorText}`
    );
  }

  const result: GetJobDetailsResponse = await response.json();
  console.log("✅ Get Job Details Response:", result);
  return result;
};


// ---------------- Job Status API ----------------
export interface JobStatusResponse {
  success: boolean;
  message: string;
  jobId: string;
  Status: string;
  LastRun: string;
}

export const getJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/get_status?job_id=${jobId}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`
    );
    throw new Error(
      `Failed to fetch job status: ${response.status} - ${errorText}`
    );
  }

  const result: JobStatusResponse = await response.json();
  console.log("✅ Get Job Status Response:", result);
  return result;
};


// ---------------- Edit Job API ----------------
export interface EditJobRequest {
  jobId: string;
  jobName: string;
  triggerType: "SCHEDULE" | "File";
  steps: JobStepConfig;
  datasource: string;
  datadestination: string;
  scheduleDetails?: ScheduleDetails;
  business_logic_rules?: Record<string, string>;
  job_type?: string;
  gname?: string;
  glue_name?: string;
  resourcegroup?: string;
  datafactory?: string;
  pipeline?: string;
}

export interface EditJobResponse {
  success: boolean;
  message: string;
  job: Job;
}

export const editJob = async (data: EditJobRequest): Promise<EditJobResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/edit_job`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`
    );
    throw new Error(`Failed to edit job: ${response.status} - ${errorText}`);
  }

  const result: EditJobResponse = await response.json();
  console.log("✅ Edit Job Response:", result);
  return result;
};


// Fetch Jobs API
export interface Job {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  category: string;
  lastRun: string;
}

export interface GetJobsResponse {
  success: boolean;
  message: string;
  jobs: Job[];
}

// -------------------- Job Metrics, System Monitor, Previous Runs --------------------
 
export interface JobMetrics {
  currentStatus: string;
  duration: string;
  startTime: string;
  expectedCompletion?: string;
  progress: number;
  recordsProcessed: string;
  issues: number;
  warnings: number;
  errors: string[];
}
 
export interface GetJobMetricsResponse {
  success: boolean;
  message: string;
  metrics: JobMetrics;
}
 
export const getJobMetrics = async (jobId: string): Promise<GetJobMetricsResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/get_job_metrics?job_id=${jobId}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
 
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch job metrics: ${response.status} - ${errorText}`);
  }

  return response.json();
};
 
 
// System Monitor

export interface SystemMonitor {
  cpu: { usage: number; cores: number };
  memory: { usage: number; memory: string };
  executionCount: { today: number; week: number; month: number; total: number };
  performance: { avgDuration: string; successRate: number };
}
 
export interface GetSystemMonitorResponse {
  success: boolean;
  message: string;
  monitor: SystemMonitor;
}
 
export const getSystemMonitor = async (jobId: string): Promise<GetSystemMonitorResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/get_system_monitor?job_id=${jobId}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
 
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch system monitor: ${response.status} - ${errorText}`);
  }

  return response.json();
};
 
 
// Previous Runs

export interface PreviousRun {
  id: string;
  runDate: string;
  duration: string;
  status: string;
  records: number;
  issues: number;
  warnings: number;
  logSummary: string[];
}
 
export interface GetPreviousRunsResponse {
  success: boolean;
  message: string;
  runs: PreviousRun[];
}
 
export const getPreviousRuns = async (jobId: string): Promise<GetPreviousRunsResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/get_previous_runs?job_id=${jobId}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
 
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch previous runs: ${response.status} - ${errorText}`);
  }

  return response.json();
};

// -------------------- Pipeline Types --------------------
export interface CreatePipelineRequest {
  pipelineName: string;
  jobIds: string[];
}

export interface Pipeline {
  nodes: any[];
  edges: any[];
  pipelineId: string;
  pipelineName: string;
  user_id: string;
  email: string;
  pipelineConfig: string[];
  createdAt: string;
  updatedAt: string;
  Status: string;
  LastRun: string;
}

export interface CreatePipelineResponse {
  success: boolean;
  message: string;
  pipeline: Pipeline;
}

export interface EditPipelineRequest {
  pipelineId: string;
  pipelineName: string;
  jobIds: string[];
}

export interface EditPipelineResponse {
  success: boolean;
  message: string;
  pipeline: Pipeline;
}

export interface RunPipelineRequest {
  pipelineId: string;
  token: string;
}

export interface RunPipelineExecution {
  jobId: string;
  executionArn: string;
  startDate: string;
}

export interface RunPipelineResponse {
  success: boolean;
  message: string;
  pipelineId: string;
  executions: RunPipelineExecution[];
}

// -------------------- Pipeline APIs --------------------

// Create Pipeline API
export const createPipeline = async (
  data: CreatePipelineRequest
): Promise<CreatePipelineResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/create-pipeline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create pipeline: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("✅ Create Pipeline Response:", result);
  return result;
};

// Edit Pipeline API
export const editPipeline = async (
  data: EditPipelineRequest
): Promise<EditPipelineResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/edit-pipeline`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to edit pipeline: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("✅ Edit Pipeline Response:", result);
  return result;
};

// Run Pipeline API
export const runPipeline = async (
  data: RunPipelineRequest
): Promise<RunPipelineResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/run-pipeline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to run pipeline: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("✅ Run Pipeline Response:", result);
  return result;
};

// ---------------- Pipelines API ----------------

// Pipeline type
export interface Pipeline {
  pipeline_id: string;
  pipeline_name: string;
  created_at: string;
  status: "CREATED" | "RUNNING" | "COMPLETED" | string;
  num_jobs: number;
}

// Get All Pipelines Response
export interface GetPipelinesResponse {
  success: boolean;
  message: string;
  pipelines: Pipeline[];
}

// Get All Pipelines API
export const getAllPipelines = async (): Promise<GetPipelinesResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/get_all_pipelines`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`
    );
    throw new Error(
      `Failed to fetch pipelines: ${response.status} - ${errorText}`
    );
  }

  const result: GetPipelinesResponse = await response.json();
  console.log("✅ Get All Pipelines Response:", result);
  return result;
};


//get pipelines job
export interface PipelineJob {
  createdAt: string; // normalize both created_at and createdAt
  datadestination: string;
  jobId: string;
  triggerType: "SCHEDULE" | "File";
  Status: string;
  email: string;
  scheduleDetails: ScheduleDetails | {};
  jobName: string;
  user_id: string;
  glue_job_name?: string; // optional
  steps: JobStepConfig | {};
  business_logic_rules: Record<string, string>;
  datasource: string;
  LastRun: string | null;
  FolderName?: string;
  FileName?: string;
  BucketName?: string;
  updatedAt?: string;
  etag?: string;
}

export interface GetPipelineJobsResponse {
  success: boolean;
  message: string;
  jobs: PipelineJob[];
}

// Get Jobs for a Pipeline API
export const getPipelineJobs = async (pipelineId: string): Promise<GetPipelineJobsResponse> => {
  const token = getAuthToken();
  const url = `${BASE_URL}/getpipelinejobs?pipeline_id=${encodeURIComponent(pipelineId)}`;
  console.log(`Fetching pipeline jobs from: ${url}`);

  const response = await fetch(url, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`);
    throw new Error(`Failed to fetch pipeline jobs: ${response.status} - ${errorText}`);
  }

  const result: GetPipelineJobsResponse = await response.json();

  // Normalize "created_at" → "createdAt"
  result.jobs = result.jobs.map(job => ({
    ...job,
    createdAt: (job as any).created_at || job.createdAt,
  }));

  console.log("✅ Get Pipeline Jobs Response:", result);
  return result;
};


// ---------------- User Aggregated Metrics ----------------

export interface UserAggregatedMetricsResponse {
  success: boolean;
  message: string;
  metrics: {
    avg_cpu_usage: number;
    avg_memory_usage: number;
    avg_success_rate: number;
  };
}

export const getUserAggregatedMetrics = async (
  userId: string
): Promise<UserAggregatedMetricsResponse> => {
  const token = getAuthToken();
  const response = await fetch(
    `${BASE_URL}/user-aggregated-metrics?user_id=${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`
    );
    throw new Error(
      `Failed to fetch user aggregated metrics: ${response.status} - ${errorText}`
    );
  }

  const result: UserAggregatedMetricsResponse = await response.json();
  console.log("✅ User Aggregated Metrics Response:", result);
  return result;
};


// Check Job by Glue Name API
export interface CheckJobGNameResponse {
  success: boolean;
  message: string;
  user: any | null;
  status_code: number;
}

export const checkJobGName = async (gname: string): Promise<CheckJobGNameResponse> => {
  const token = getAuthToken();
  const url = `${BASE_URL}/check-job-gname?gname=${encodeURIComponent(gname)}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`
    );
    throw new Error(`Failed to check job gname: ${response.status} - ${errorText}`);
  }

  const result: CheckJobGNameResponse = await response.json();
  console.log("✅ Check Job GName Response:", result);
  return result;
};



// Create Job Config Types
export interface JobStepConfig {
  rules: "executed" | "skipped" | "used";
  ner: "executed" | "skipped" | "used";
  etl?: "executed" | "skipped" | "used"; // optional since you’re passing it
  businessLogic: "executed" | "skipped" | "used";
  datatransformations?: "executed" | "skipped" | "used"; // keep optional
}

export interface ScheduleDetails {
  frequency?: string; // e.g., "daily"
  time?: string;      // e.g., "10:23"
}

export interface CreateJobConfigRequest {
  jobName: string;
  triggerType: "SCHEDULE" | "File";
  steps: JobStepConfig;
  datasource: string;         // e.g., "s3://bucket/key.csv"
  datadestination: string;    // e.g., "s3://bucket/output/"
  scheduleDetails?: ScheduleDetails;
  business_logic_rules?: { [key: string]: string }; // dynamic rules
  job_type?: string;          // optional
  glue_name?: string;         // optional
  gname: string;              // ✅ newly added
}

export interface JobConfigResponse {
  success: boolean;
  message: string;
  job: {
    jobId: string;
    user_id: string;
    email: string;
    jobName: string;
    triggerType: string;
    steps: JobStepConfig;
    datasource: string;
    datadestination: string;
    scheduleDetails: ScheduleDetails | {};
    business_logic_rules?: { [key: string]: string };
    createdAt: string;
    BucketName: string;
    FolderName: string;
    FileName: string;
    Status: string;
    LastRun: string;
    etag: string;
    job_type?: string;
    glue_name?: string;
    gname: string;  // ✅ newly added
  };
}

// Create Job Config API
export const createJobConfig = async (
  data: CreateJobConfigRequest
): Promise<JobConfigResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/create-job-config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to create job config: ${response.status} - ${errorText}`
    );
  }

  const result: JobConfigResponse = await response.json();
  console.log("✅ Create Job Config Response:", result);
  return result;
};

// Local File Upload API
export const uploadFile = async (
  file: File, 
  userId: string, 
  folderName: string = "scripts"
): Promise<{success: boolean, message: string, s3_path?: string}> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(
    `${BASE_URL}/upload-file?user_id=${userId}&folder_name=${folderName}`, 
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload file: ${response.status} - ${errorText}`);
  }

  return response.json();
};