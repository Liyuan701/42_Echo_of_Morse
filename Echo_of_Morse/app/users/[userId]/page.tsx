import PageShell from "@/components/layout/page-shell";
import { Card } from "@/components/ui";
import { mockFriends } from "@/components/chat/faux-chat-data";
import ProfileFriends from "@/components/profile/profile-friends";

type UserProfilePageProps = {
  params: {
    userId: string;
  };
};

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const friend = mockFriends.find((item) => item.id === params.userId);

	if (!friend) {
	return (
		<main id="main-content">
		<PageShell>
			<Card>
			<h1>User not found</h1>
			<p>We could not find this user profile.</p>
			</Card>
		</PageShell>
		</main>
	);
	}

	return (
	<main id="main-content">
		<PageShell>
		<ProfileFriends
			name={friend.displayName || friend.username || "Unknown user"}
			username={friend.username}
			image={friend.avatarUrl}
			isOnline={friend.isOnline}
		/>
		</PageShell>
	</main>
	);
}

// ! i18n: move public profile fallback text, online/offline labels, avatar alt text, and temporary description into the i18n dictionary.
// ! i18n: keep friend.displayName and friend.username as dynamic user data.
