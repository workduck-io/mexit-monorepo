import { Icon } from '@iconify/react'
import { MIcon, mog, Reaction as ReactionType, UserReaction } from '@mexit/core'
import { IconDisplay, Tooltip } from '@mexit/shared'
import { debounce } from 'lodash'
import { reactionsWithCount } from '../../Hooks/useReactions'
import { useReactionAPI } from '../../Hooks/API/useCommentAndReactionAPI'
import {
  CompressedReactionGroup,
  ReactionButton,
  ReactionCount,
  ReactionDetailsReactions,
  ReactionDetailsRow,
  ReactionDetailsUser,
  ReactionsWrapper
} from './Reactions.style'
import { useMemo, useState } from 'react'
import { useMentions } from '../../Hooks/useMentions'
import { ProfileImage } from '../User/ProfileImage'

interface UserReactionRowProps {
  userReaction: UserReaction
}

const UserReactionRow = ({ userReaction }: UserReactionRowProps) => {
  const { reactions, userId } = userReaction
  const { getUserFromUserid } = useMentions()

  const user = useMemo(() => {
    const u = getUserFromUserid(userId)
    if (u) return u
  }, [userId])

  return (
    <ReactionDetailsRow>
      <ReactionDetailsUser>
        <ProfileImage size={20} email={user?.email} />@{user && user.alias}
      </ReactionDetailsUser>
      <ReactionDetailsReactions>
        {reactions.map((r) => (
          <IconDisplay icon={r} />
        ))}
      </ReactionDetailsReactions>
    </ReactionDetailsRow>
  )
}

interface ReactionDetailsProps {
  details: UserReaction[]
}

const ReactionDetails = ({ details }: ReactionDetailsProps) => {
  // mog('ReactionDetailsRender', { details })
  return (
    <>
      {(details ?? []).map((reaction) => (
        <UserReactionRow userReaction={reaction} />
      ))}
    </>
  )
}

interface ReactionsProps {
  reactions: ReactionType[]
  onToggleReaction: (reactionVal: MIcon) => void
  getReactionDetails?: () => Promise<UserReaction[]>
}

export const Reactions = ({ reactions, onToggleReaction, getReactionDetails }: ReactionsProps) => {
  const BlockReactions = reactionsWithCount(reactions)
  const [details, setDetails] = useState<UserReaction[] | null>(null)
  const toggleReaction = (reactionVal: MIcon) => {
    onToggleReaction(reactionVal)
  }

  // if (reactions.length > 0) {
  //   mog('BlockReactions', { BlockReactions, reactions })
  // }

  const onHover = () => {
    // mog('onHover we shall fetch details')
    if (!getReactionDetails) {
      return
    }

    // Fetch if not fetched before
    if (details === null)
      getReactionDetails().then((res) => {
        // mog('got reaction details', { res })
        setDetails(res)
      })
  }

  const onDelayPerform = debounce(onHover, 500)

  return (
    <Tooltip content={<ReactionDetails details={details || []} />}>
      <ReactionsWrapper>
        {BlockReactions.map((reaction) => (
          <ReactionButton
            onMouseEnter={() => onDelayPerform()}
            onClick={() => toggleReaction(reaction.reaction)}
            key={reaction.reaction.value}
          >
            <IconDisplay size={20} icon={reaction.reaction} />
            {reaction.count > 0 && <ReactionCount>{reaction.count}</ReactionCount>}
          </ReactionButton>
        ))}
      </ReactionsWrapper>
    </Tooltip>
  )
}

interface BlockReactionProps {
  previewReactions: {
    reaction: MIcon
    count: number
  }[]
}

export const BlockReaction = ({ previewReactions }: BlockReactionProps) => {
  return previewReactions.length > 0 ? (
    <CompressedReactionGroup>
      {previewReactions.map((r, i) => (
        <IconDisplay key={i} size={12} icon={r.reaction} />
      ))}
    </CompressedReactionGroup>
  ) : (
    <Icon icon="fluent:emoji-add-20-regular" />
  )
}
