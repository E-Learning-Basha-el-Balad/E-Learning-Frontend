'use client';
import { useState, useEffect, useRef } from "react";
import { Course } from "../types/Course";
import { Module } from "../types/Module";
import axios from "axios";

const StudentCourseDetails = ({ course }: { course: Course }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [moduleContent, setModuleContent] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch modules for the course
  useEffect(() => {
    const fetchModules = async () => {
      if (!course?._id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:3000/courses/${course._id}/modules`,
          { withCredentials: true }
        );

        if (response.data && Array.isArray(response.data)) {
          setModules(response.data);
          if (response.data.length > 0) {
            setSelectedModule(response.data[0]._id);
            setModuleContent(response.data[0].content || "");
          }
        }
      } catch (err: any) {
        console.error("Error fetching modules:", err);
        setError(err.response?.data?.message || "Failed to fetch modules");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [course?._id]);

  // Update module content when selected module changes
  useEffect(() => {
    if (selectedModule) {
      const selectedModuleData = modules.find((mod) => mod._id === selectedModule);
      setModuleContent(selectedModuleData?.content || "No content available for this module.");
    }
  }, [selectedModule, modules]);

  // Fetch notes for the selected module
  useEffect(() => {
    const fetchNotes = async () => {
      if (!selectedModule || !course?._id) return;

      try {
        setLoading(true);
        setError(null);

        const notesResponse = await axios.get(
          `http://localhost:3000/notes/${course._id}/${selectedModule}`,
          { withCredentials: true }
        );

        if (notesResponse.data && Array.isArray(notesResponse.data)) {
          setNotes(notesResponse.data);
        }
      } catch (err: any) {
        console.error("Error fetching notes:", err);
        setError(err.response?.data?.message || "Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedModule, course?._id]);

  // Handle quick note submission
  const handleQuickNoteSubmit = async () => {
    if (!newNote.trim() || !selectedModule || !course?._id) {
      setError("Note content cannot be empty and module must be selected");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `http://localhost:3000/notes`,
        {
          title: "Quick Note",
          content: newNote,
          studentId: course._id,
          moduleId: selectedModule,
        },
        { withCredentials: true }
      );

      if (response.data) {
        setNotes((prevNotes) => [...prevNotes, response.data]);
        setNewNote("");
      }
    } catch (err: any) {
      console.error("Error submitting note:", err);
      setError(err.response?.data?.message || "Failed to save the note");
    } finally {
      setLoading(false);
    }
  };

  // Handle autosaving a note
  const handleAutosave = async (noteId: string, content: string) => {
    try {
      if (!content.trim()) return; // Avoid saving empty content
      await axios.patch(
        `http://localhost:3000/notes/${noteId}`,
        { content },
        { withCredentials: true }
      );
      console.log("Autosaved successfully");
    } catch (err: any) {
      console.error("Error autosaving note:", err);
    }
  };

  // Watch for changes to `editedContent` to trigger autosave
  useEffect(() => {
    if (!editingNote) return;

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      handleAutosave(editingNote, editedContent);
    }, 6000); // Save after 6 seconds

    return () => clearTimeout(autosaveTimerRef.current!);
  }, [editedContent, editingNote]);

  // Handle editing a note
  const handleEditContentChange = (noteId: string, content: string) => {
    setEditingNote(noteId);
    setEditedContent(content);
  };

  // Handle deleting a note
  const handleDeleteNote = async (noteId: string) => {
    try {
      setLoading(true);
      setError(null);

      await axios.delete(`http://localhost:3000/notes/${noteId}`, {
        withCredentials: true,
      });

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (err: any) {
      console.error("Error deleting note:", err);
      setError(err.response?.data?.message || "Failed to delete the note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center py-4">
          <h1 className="h3">{course.title}</h1>
        </div>

        <div className="card-body">
          {/* Modules Section */}
          <div className="mb-4">
            <h2 className="h5">MODULES</h2>
            <select
              className="form-select mb-3"
              value={selectedModule || ""}
              onChange={(e) => setSelectedModule(e.target.value)}
            >
              {modules.map((module) => (
                <option key={module._id} value={module._id}>
                  {module.title}
                </option>
              ))}
            </select>

            <h4>Module Content</h4>
            <div className="border p-3 rounded mb-4">{moduleContent}</div>

            <h4>Quick Note</h4>
            <textarea
              className="form-control mb-2"
              placeholder="Write a quick note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button className="btn btn-primary mb-4" onClick={handleQuickNoteSubmit}>
              Save Note
            </button>
          </div>

          <div>
            <h2>Saved Notes</h2>
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note._id} className="mb-3 p-3 border rounded">
                  {editingNote === note._id ? (
                    <>
                      <textarea
                        className="form-control mb-2"
                        value={editedContent}
                        onChange={(e) => handleEditContentChange(note._id, e.target.value)}
                      />
                      <button
                        className="btn btn-success me-2"
                        onClick={() => setEditingNote(null)}
                      >
                        Stop Editing
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{note.content}</p>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => {
                          setEditingNote(note._id);
                          setEditedContent(note.content);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>No notes available for this module</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetails;
