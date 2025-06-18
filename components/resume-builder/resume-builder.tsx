"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Download, Eye } from "lucide-react"

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  graduationDate: string
  gpa?: string
}

interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: string[]
}

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    summary: "",
    experiences: [],
    education: [],
    skills: [],
  })

  const [newSkill, setNewSkill] = useState("")

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setResumeData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExp],
    }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }))
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
    }
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const generateResumeText = () => {
    const { personalInfo, summary, experiences, education, skills } = resumeData

    let resume = `${personalInfo.fullName}\n`
    if (personalInfo.email) resume += `Email: ${personalInfo.email}\n`
    if (personalInfo.phone) resume += `Phone: ${personalInfo.phone}\n`
    if (personalInfo.location) resume += `Location: ${personalInfo.location}\n`
    if (personalInfo.linkedin) resume += `LinkedIn: ${personalInfo.linkedin}\n`
    if (personalInfo.website) resume += `Website: ${personalInfo.website}\n`

    if (summary) {
      resume += `\nPROFESSIONAL SUMMARY\n${summary}\n`
    }

    if (experiences.length > 0) {
      resume += `\nEXPERIENCE\n`
      experiences.forEach((exp) => {
        resume += `${exp.position} | ${exp.company} | ${exp.startDate} - ${exp.current ? "Present" : exp.endDate}\n`
        if (exp.description) resume += `${exp.description}\n\n`
      })
    }

    if (education.length > 0) {
      resume += `\nEDUCATION\n`
      education.forEach((edu) => {
        resume += `${edu.degree} in ${edu.field} | ${edu.institution} | ${edu.graduationDate}\n`
        if (edu.gpa) resume += `GPA: ${edu.gpa}\n`
        resume += `\n`
      })
    }

    if (skills.length > 0) {
      resume += `\nSKILLS\n${skills.join(", ")}\n`
    }

    return resume
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resume Builder</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, linkedin: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={resumeData.personalInfo.website}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, website: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write a brief summary of your professional background..."
                value={resumeData.summary}
                onChange={(e) => setResumeData((prev) => ({ ...prev, summary: e.target.value }))}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Experience
                <Button onClick={addExperience} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.experiences.map((exp) => (
                <div key={exp.id} className="border p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <Input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      />
                      <Input
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="ml-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                    />
                    <Input
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      disabled={exp.current}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                    />
                    <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
                  </div>
                  <Textarea
                    placeholder="Describe your responsibilities and achievements..."
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    rows={3}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Education
                <Button onClick={addEducation} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="border p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <Input
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      />
                      <Input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)} className="ml-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                    />
                    <Input
                      placeholder="Graduation Date"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                    />
                    <Input
                      placeholder="GPA (optional)"
                      value={edu.gpa || ""}
                      onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-2 text-blue-600 hover:text-blue-800">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
              <CardDescription>This is how your resume will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border p-6 rounded-lg min-h-[600px] font-mono text-sm whitespace-pre-line">
                {generateResumeText() || "Start filling out the form to see your resume preview..."}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
