export interface Module {
    _id: string; // Unique identifier for each module
    title: string; // Title of the accordion item
    content: string;
    filePath :string[] 
    resources :string[]
    uploadedBy:string
  };