import React, { useState, useEffect, useContext } from "react";

import { UserContext } from "../index";

import Greeting from "./Greeting";
import LogInOut from "./LogInOut";

import {
	Avatar,
	Text,
	Button,
	Paper,
	Notification,
	Card,
	Image,
	Group,
	Badge,
	ActionIcon,
	createStyles,
	Tooltip,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconCheck, IconX, IconHeart, IconCopy } from "@tabler/icons";

import "../index.css";

import profilePicture from "../filip.jpg";

const config = require("../../../config");

export default function RestrictedPage({ body }) {
	return (
		<>
			<header>
				<Greeting body={body} />
				<LogInOut body={body} uri={`http://localhost:${config.serverPort}`} />
			</header>
			<main className={"main"}>
				<ProtectedDemoPage
					avatar={profilePicture}
					name={"Filip Grebowski"}
					email={"filip@permit.io"}
					job={"Developer Advocate"}
				/>
			</main>
		</>
	);
}

// Protected page that can only be accessed after successful authentication.
function ProtectedDemoPage({ avatar, name, email, job }) {
	const [showMore, setShowMore] = useState(false);
	const [personalInfo, setPersonalInfo] = useState(false);
	const [error, setError] = useState(false);

	const user = useContext(UserContext);

	// Permit generic permission call to the backend.
	const checkPermissions = async (action, resource) => {
		const permissionData = {
			action: action,
			resource: resource,
			userData: user,
		};

		console.log("USER: ", user);

		const hasPermission = await fetch("http://localhost:9000/permit", {
			method: "POST",
			body: JSON.stringify(permissionData),
			headers: {
				"Content-Type": "application/json",
			},
		});

		return hasPermission;
	};

	const learnMore = async () => {
		// Checking if user can view personal info on the card resource.
		const result = await checkPermissions("view-personal-info", "card");

		if (result.status !== 403) {
			setShowMore(true);

			// Checking if user can copy their GPG key.
			const result = await checkPermissions("view-gpg-key", "card");

			if (result.status !== 403) {
				setPersonalInfo(true);
			} else {
				setPersonalInfo(false);
			}
		} else {
			setError(true);
		}
	};

	return (
		<div className={"container"}>
			<main className={"main"}>
				{error ? (
					<Notification
						icon={<IconX size={18} />}
						color="red"
						style={{ marginBottom: "20px" }}
						onClose={() => setError(false)}
					>
						403: You are Unauthorized to do this!
					</Notification>
				) : null}
				{showMore ? (
					<LearnMoreBadgeCard
						image={profilePicture}
						title={"Filip Grebowski 👋"}
						description={
							"YouTube Creator, Engineer & Developer Advocate @ Permit.io"
						}
						country={"United Kingdom"}
						badges={[
							{ label: "Videography", emoji: "📹" },
							{ label: "Coding", emoji: "🤓" },
							{ label: "Photography", emoji: "📸" },
							{ label: "Fishing", emoji: "🎣" },
							{ label: "Snowboarding", emoji: "🏂" },
						]}
						visibility={() => setShowMore(false)}
						personalInfo={personalInfo}
					/>
				) : (
					<Paper
						radius="md"
						withBorder
						p="lg"
						sx={(theme) => ({
							backgroundColor: theme.white,
						})}
					>
						<Avatar src={avatar} size={120} radius={120} mx="auto" />
						<Text align="center" size="lg" weight={500} mt="md">
							{name}
						</Text>
						<Text align="center" color="dimmed" size="sm">
							{email} • {job}
						</Text>

						<Button variant="default" fullWidth mt="md" onClick={learnMore}>
							Learn more
						</Button>
					</Paper>
				)}
			</main>
		</div>
	);
}

function LearnMoreBadgeCard({
	image,
	title,
	description,
	country,
	badges,
	visibility,
	personalInfo,
}) {
	const useStyles = createStyles((theme) => ({
		card: {
			width: 280,
			backgroundColor:
				theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
		},

		section: {
			borderBottom: `1px solid ${
				theme.colorScheme === "dark"
					? theme.colors.dark[4]
					: theme.colors.gray[3]
			}`,
			paddingLeft: theme.spacing.md,
			paddingRight: theme.spacing.md,
			paddingBottom: theme.spacing.md,
		},

		like: {
			color: theme.colors.red[6],
		},

		label: {
			textTransform: "uppercase",
			fontSize: theme.fontSizes.xs,
			fontWeight: 700,
		},
	}));

	const { classes, theme } = useStyles();

	const features = badges.map((badge) => (
		<Badge
			color={theme.colorScheme === "dark" ? "dark" : "gray"}
			key={badge.label}
			leftSection={badge.emoji}
		>
			{badge.label}
		</Badge>
	));

	return (
		<Card withBorder radius="md" p="md" className={classes.card}>
			<Card.Section>
				<Image src={image} alt={title} height={180} />
			</Card.Section>

			<Card.Section className={classes.section} mt="md">
				<Group position="apart">
					<Text size="lg" weight={500}>
						{title}
					</Text>
					<Badge size="sm">{country}</Badge>
				</Group>
				<Text size="sm" mt="xs">
					{description}
				</Text>
			</Card.Section>

			<Card.Section className={classes.section}>
				<Text mt="md" className={classes.label} color="dimmed">
					Hobbies
				</Text>
				<Group spacing={7} mt={5}>
					{features}
				</Group>
			</Card.Section>

			<div
				style={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				{personalInfo ? <ButtonCopy /> : null}
			</div>

			<Group mt="xs">
				<Button radius="md" style={{ flex: 1 }} onClick={visibility}>
					Back to Profile
				</Button>
				<ActionIcon variant="default" radius="md" size={36}>
					<IconHeart size={18} className={classes.like} stroke={1.5} />
				</ActionIcon>
			</Group>
		</Card>
	);
}

function ButtonCopy() {
	const user = useContext(UserContext);
	const clipboard = useClipboard();

	// Fetches the GPG key stored in the backend.
	const fetchGPG = async () => {
		let GPGKey = "GPG Key has been copied.";

		const res = await fetch("http://localhost:9000/getGPG", {
			method: "POST",
			body: JSON.stringify(user),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (res.status === 200) {
			const json = await res.json();
			GPGKey = json.gpg;
		}

		alert(GPGKey);

		return GPGKey;
	};

	return (
		<Tooltip
			label="Key copied successfully."
			offset={5}
			position="bottom"
			radius="sm"
			transition="slide-down"
			transitionDuration={100}
			opened={clipboard.copied}
		>
			<Button
				variant="light"
				rightIcon={
					clipboard.copied ? (
						<IconCheck size={20} stroke={1.5} />
					) : (
						<IconCopy size={20} stroke={1.5} />
					)
				}
				radius="xl"
				size="xs"
				styles={{
					root: {
						paddingRight: 14,
						height: 34,
						marginTop: 20,
						marginBottom: 20,
					},
					rightIcon: { marginLeft: 22 },
				}}
				onClick={() => clipboard.copy(fetchGPG())}
			>
				Copy GPG Key
			</Button>
		</Tooltip>
	);
}
