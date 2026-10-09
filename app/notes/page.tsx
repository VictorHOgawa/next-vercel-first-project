'use client'
import { useEffect, useState } from "react"

interface NoteType {
  id: number;
  text: string;
  categoryId?: string;
  pinned: boolean
}

export default function Notes() {
  const [notes, setNotes] = useState<NoteType[]>([])
  const [newNoteText, setNewNoteText] = useState<string>("")

  const fetchNotes = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes`)
    const notes = await res.json()
    if (res.ok) {
      return setNotes(notes)
    }
    return alert(notes.error)
  }

  const updateNotePinned = async (noteId: number, pinStatus: boolean) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: pinStatus })
    })
    if (res.ok) {
      return fetchNotes()
    }
    const data: { error: string } = await res.json()
    return alert(data.error)
  }

  const deleteNote = async (noteId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`,
      {
        method: "DELETE"
      })
    if (res.ok) {
      return fetchNotes()
    }
    const data: { error: string } = await res.json()
    return alert(data.error)
  }

  const createNote = async (newNoteText: string) => {
    if (!newNoteText || newNoteText === "") {
      return alert("Please fill in the text for the note")
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes`, {
      method: "POST",
      body: JSON.stringify({ text: newNoteText }),
      headers: { "Content-Type": "application/json" }
    })
    if (res.ok) {
      setNewNoteText("")
      return fetchNotes()
    }
    const data: { error: string } = await res.json()
    return alert(data.error)
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <>
      <form onSubmit={(e) => {
        e.preventDefault();
        createNote(newNoteText)
      }}>
        <div>
          <label htmlFor="text">Text</label>
          <input id="text" type="text" value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} />
          <button type="submit">Create note</button>
        </div>
      </form>
      <ul>
        {
          notes.map((n) =>
            <li key={n.id}>
              {n.text} - {n.pinned ? "pinned" : "not pinned"}
              <button onClick={() => updateNotePinned(n.id, !n.pinned)}>
                {n.pinned ? "Unpin" : "Pin"} this note
              </button>
              <button onClick={() => {
                if (confirm("Are you sure you want to delete this note?")) {
                  deleteNote(n.id)
                }
              }}>
                Delete note
              </button>
            </li>
          )
        }
      </ul>
    </>
  )
}
