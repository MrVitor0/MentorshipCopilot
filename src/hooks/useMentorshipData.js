import { useState, useEffect } from 'react'
import { 
  getMentorshipById, 
  getJoinRequestsForMentorship, 
  getUserProfile,
  getInvitationsForMentorship
} from '../services/firestoreService'

export default function useMentorshipData(id) {
  const [mentorship, setMentorship] = useState(null)
  const [joinRequests, setJoinRequests] = useState([])
  const [joinRequestsWithProfiles, setJoinRequestsWithProfiles] = useState([])
  const [invitations, setInvitations] = useState([])
  const [invitationsWithProfiles, setInvitationsWithProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMentorshipData = async () => {
      if (!id) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Fetch mentorship
        const mentorshipData = await getMentorshipById(id)
        setMentorship(mentorshipData)
        
        // Fetch invitations (mentors who were invited by PM)
        const invites = await getInvitationsForMentorship(id)
        setInvitations(invites)
        
        // Fetch mentor profiles for invitations
        if (invites.length > 0) {
          const inviteProfiles = await Promise.all(
            invites.map(async (inv) => {
              const profile = await getUserProfile(inv.mentorId)
              return { ...inv, mentorProfile: profile }
            })
          )
          setInvitationsWithProfiles(inviteProfiles)
        }
        
        // Only fetch join requests if there's no mentor assigned
        if (!mentorshipData?.mentorId) {
          const requests = await getJoinRequestsForMentorship(id)
          setJoinRequests(requests)
          
          // Fetch mentor profiles for join requests
          if (requests.length > 0) {
            const profiles = await Promise.all(
              requests.map(async (req) => {
                const profile = await getUserProfile(req.mentorId)
                return { ...req, mentorProfile: profile }
              })
            )
            setJoinRequestsWithProfiles(profiles)
          }
        }
      } catch (err) {
        console.error('Error fetching mentorship:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMentorshipData()
  }, [id])

  const refetch = () => {
    setLoading(true)
    // Trigger re-fetch by changing a dependency
  }

  return {
    mentorship,
    joinRequests,
    joinRequestsWithProfiles,
    invitations,
    invitationsWithProfiles,
    loading,
    error,
    refetch
  }
}

