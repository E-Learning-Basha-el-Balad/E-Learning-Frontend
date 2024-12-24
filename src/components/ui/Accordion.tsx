import React, { useState } from "react";
import { Module } from "../../app/types/Module";
import axios from "axios";

type AccordionProps = {
  modules: Module[];
  isGuest: boolean;
  isInstructor: boolean; // Array of modules
};

const Accordion: React.FC<AccordionProps> = ({ modules, isGuest, isInstructor }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const renderFile = (filePath: string) => {
    const fileExtension = filePath.split('.').pop()?.toLowerCase();

    // Form the URL to access the file from the backend
    const fileUrl = `http://localhost:3000/${filePath}`; // Adjust the base URL as needed
    if (fileExtension === 'pdf') {
      return <embed src={fileUrl} width="100%" height="600px" type="application/pdf" />;
    }
    
    if (fileExtension === 'mp4') {
      return (
        <video controls width="100%">
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return <p>Unsupported file type</p>;
  };

  const toggleOutdated = async (moduleId: string,course_id:string, outdatedStatus: boolean) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/courses/${course_id}/modules/${moduleId}/flag`, 
        { "flag": !outdatedStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedModules = modules.map((module) =>
          module._id === moduleId ? { ...module, outdated: !outdatedStatus } : module
        );
        // Update the modules state with the new outdated status
        // Assuming you have a state to manage `modules` in the parent component
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating outdated status", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="accordion accordion-flush" id="accordionFlushExample">
      {modules.map((module) => (
        <div className="accordion-item" key={module._id}>
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#flush-collapse-${module._id}`}
              aria-expanded="false"
              aria-controls={`flush-collapse-${module._id}`}
            >
           {module.title}
            </button>
          </h2>
          <div
            id={`flush-collapse-${module._id}`}
            className="accordion-collapse collapse"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <p>{module.content}</p>
              {module.filePath && module.filePath.length > 0 && (
                <div>
                  {module.filePath.map((filePath, index) => (
                    <div key={index} className="file-item">
                      {<div> {filePath}</div>}
                      {!isGuest && renderFile(filePath)}
                    </div>
                  ))}
                </div>
              )}


              {

              
              <a href={`/quizzes?moduleId=${module._id}`} className="btn btn-primary me-2">
                <i className="bi bi-file-text me-2"></i>
                View Quiz
              </a>
}

              {
                isInstructor &&
              <a href={`/questions?moduleId=${module._id}`} className="btn btn-secondary me-2">
                <i className="bi bi-question-circle me-2"></i>
                View Question Banks
              </a>
}


              {
                isInstructor &&
              
              <a href={`/Courses/${module.course_id}}/update-module/${module._id}`} className="btn btn-secondary me-2">
                <i className="bi bi-pencil-square me-2" />
                Edit Module
              </a>
}

              {/* Button to toggle the outdated status */}
              {isInstructor && (
                <button
                  className={`btn ${module.outdated ? 'btn-danger' : 'btn-warning'}`}
                  onClick={() => toggleOutdated(module._id,module.course_id,module.outdated)}
                  disabled={loading}
                >
                  {module.outdated ? 'Outdated' : 'Set Outdated'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
