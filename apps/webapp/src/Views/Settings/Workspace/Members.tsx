import { Margin, ProfileImage } from '@mexit/shared'

import {
  ShareAlias,
  ShareAliasWithImage,
  SharedPermissionsTable,
  ShareEmail,
  ShareOwnerTag,
  SharePermission,
  ShareRow,
  TableBody,
  TableContainer
} from '../../../Components/Mentions/styles'
import { DeletionWarning } from '../../../Components/Modals/DeleteSpaceModal/styled'
import { MembersContainer, SmallHeading } from '../styled'

const Members = ({ members }) => {
  return (
    <MembersContainer>
      <SmallHeading>Team Members</SmallHeading>
      <DeletionWarning>Manage your team members and their account permissions here.</DeletionWarning>
      <Margin />
      <TableContainer id="mexit-table-container">
        <SharedPermissionsTable>
          <TableBody>
            {members.map((user) => {
              return (
                <ShareRow key={`${user.id}`} isRevoked={false}>
                  <ShareAlias>
                    <ShareAliasWithImage>
                      <ProfileImage email={user.email} size={24} />
                      {`${user.alias}`}
                    </ShareAliasWithImage>
                  </ShareAlias>
                  <ShareEmail>{user.email}</ShareEmail>

                  <SharePermission disabled>
                    <ShareOwnerTag>Owner</ShareOwnerTag>
                  </SharePermission>
                </ShareRow>
              )
            })}
          </TableBody>
        </SharedPermissionsTable>
      </TableContainer>
    </MembersContainer>
  )
}

export default Members
