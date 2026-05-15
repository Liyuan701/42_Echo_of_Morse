import PageShell from "@/components/layout/page-shell";
import ProfileFriends from "@/components/profile/profile-friends";
import ProfileUserNotFound from "@/components/profile/profile-friends-not-found";

type UserProfilePageProps = {
  params: {
    userId: string;
  };
};

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/users/${params.userId}`,
    { cache: "no-store" }
  );

	if (!response.ok) {
		return (
			<main id="main-content">
			<PageShell>
				<ProfileUserNotFound />
			</PageShell>
			</main>
		);
	}

  const user = await response.json();

  return (
    <main id="main-content">
      <PageShell>
        <ProfileFriends
          name={user.username}
          username={user.username}
          image={user.image}
          isOnline={user.isOnline}
          bio={user.bio}
          learningLevel={user.learningLevel}
          friendCount={user.friendCount}
          createdAt={user.createdAt}
        />
      </PageShell>
    </main>
  );
}

// ! i18n: move public profile fallback text, online/offline labels, avatar alt text, and temporary description into the i18n dictionary.
// ! i18n: keep friend.displayName and friend.username as dynamic user data.