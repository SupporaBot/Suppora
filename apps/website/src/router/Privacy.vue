<script lang="ts" setup>

    const lastUpdated = ref('April 20, 2026')

    // URLs (edit later if needed)
    const SUPPORT_EMAIL = "support@suppora.app"
    const DISCORD_URL = "https://discord.gg/your-server"
    const WEBSITE_URL = "https://suppora.app"

</script>

<template>
    <main class="flex w-full grow flex-col p-6">
        <div class="max-w-4xl mx-auto py-12 pb-2 px-6 space-y-8">

            <h1 class="text-4xl font-semibold">Privacy Policy</h1>

            <p class="font-light">
                Last updated: {{ lastUpdated }}
            </p>

            <p class="font-light">
                This Privacy Policy describes how <b>Suppora</b> ("we", "our", or "us") collects, uses, discloses, and
                safeguards information when you use our website, Discord bot, and related services (collectively, the
                "Services").
            </p>

            <p class="font-light">
                By accessing or using the Services, you acknowledge that you have read and understood this Privacy
                Policy.
            </p>

            <!-- INFORMATION WE COLLECT -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">1. Information We Collect</h2>

                <p>We collect information necessary to operate, maintain, and improve the Services, including:</p>

                <ul class="list-disc ml-5 space-y-2">
                    <li>
                        <b>Account & Authentication Data:</b> When you authenticate via Discord, we collect identifiers
                        such as your Discord user ID, username, avatar, email address (if provided), and server
                        memberships.
                    </li>

                    <li>
                        <b>Server Configuration Data:</b> We store configuration data created by users, including ticket
                        panels, workflows, permissions, settings, and related metadata.
                    </li>

                    <li>
                        <b>User-Generated Content:</b> We process and store content submitted through the Services,
                        including messages, support tickets, and any data transmitted through bot interactions.
                    </li>

                    <li>
                        <b>AI Knowledge Content:</b> Files, text, or other materials uploaded by users for use with AI
                        features are stored and processed to enable contextual responses.
                    </li>

                    <li>
                        <b>Technical & Usage Data:</b> We may collect technical data such as IP addresses, device
                        information, browser type, and system logs for security, diagnostics, and service improvement.
                    </li>
                </ul>
            </section>

            <!-- PURPOSE -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">2. Purpose of Processing</h2>

                <p>We process information for legitimate business purposes, including:</p>

                <ul class="list-disc ml-5 space-y-2">
                    <li>Providing, operating, and maintaining the Services</li>
                    <li>Authenticating users and managing sessions</li>
                    <li>Enabling ticketing functionality and communication workflows</li>
                    <li>Providing optional AI-powered responses and automation</li>
                    <li>Monitoring system performance, debugging, and preventing abuse</li>
                    <li>Analyzing usage trends, subject to applicable consent requirements</li>
                </ul>
            </section>

            <!-- AI -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">3. AI Features and Automated Processing</h2>

                <p>
                    Certain features of the Services utilize artificial intelligence ("AI") to generate responses and
                    automate workflows. These features are optional and may be enabled or disabled by server
                    administrators.
                </p>

                <ul class="list-disc ml-5 space-y-2">
                    <li>
                        When AI features are enabled, relevant message content and user-provided knowledge data may be
                        transmitted to third-party AI service providers for processing.
                    </li>

                    <li>
                        We act as an intermediary processor of this data on behalf of server administrators and users.
                    </li>

                    <li>
                        We do not use user data to train our own AI models.
                    </li>

                    <li>
                        Third-party AI providers may process data in accordance with their own privacy policies and
                        terms.
                    </li>

                    <li>
                        Only the data necessary to generate a response is transmitted.
                    </li>
                </ul>

                <p>
                    Users and server administrators are solely responsible for determining what data is submitted for AI
                    processing.
                </p>
            </section>

            <!-- SHARING -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">4. Disclosure of Information</h2>

                <p>We may disclose information to third-party service providers strictly as necessary to operate the
                    Services, including:</p>

                <ul class="list-disc ml-5 space-y-2">
                    <li>Hosting and infrastructure providers</li>
                    <li>Database and authentication providers</li>
                    <li>Discord, to enable bot functionality and integrations</li>
                    <li>AI processing providers for AI-enabled features</li>
                    <li>Error monitoring providers such as :contentReference[oaicite:0]{index=0}</li>
                    <li>Analytics providers such as :contentReference[oaicite:1]{index=1} (subject to user consent)</li>
                </ul>

                <p>
                    We do not sell personal data to third parties.
                </p>
            </section>

            <!-- RETENTION -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">5. Data Retention</h2>

                <ul class="list-disc ml-5 space-y-2">
                    <li>
                        Data is retained for as long as necessary to provide the Services and fulfill legitimate
                        business purposes.
                    </li>

                    <li>
                        All server-specific data is deleted upon removal of the bot from a Discord server.
                    </li>

                    <li>
                        User account data is retained until explicitly deleted by the user or upon request.
                    </li>

                    <li>
                        AI knowledge content remains stored until removed by the user or server administrator.
                    </li>
                </ul>

                <p>
                    Users may request deletion of their data at any time by contacting {{ SUPPORT_EMAIL }}.
                </p>
            </section>

            <!-- RIGHTS -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">6. Your Data Protection Rights</h2>

                <p>
                    Depending on your jurisdiction, including under applicable data protection laws such as GDPR, you
                    may have the right to:
                </p>

                <ul class="list-disc ml-5 space-y-2">
                    <li>Access personal data we hold about you</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to or restrict certain processing</li>
                    <li>Request data portability</li>
                </ul>

                <p>
                    To exercise these rights, contact {{ SUPPORT_EMAIL }}.
                </p>
            </section>

            <!-- COOKIES -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">7. Cookies and Tracking Technologies</h2>

                <p>
                    We use cookies and similar technologies to support authentication and analyze usage.
                </p>

                <ul class="list-disc ml-5 space-y-2 mb-2">
                    <li>Essential cookies are required for core functionality</li>
                    <li>Analytics technologies (such as Google Analytics) are used only with user consent</li>
                </ul>
            </section>

            <!-- SECURITY -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">8. Data Security</h2>

                <p>
                    We implement appropriate technical and organizational safeguards designed to protect information.
                    However, no method of transmission or storage is completely secure.
                </p>
            </section>

            <!-- CHILDREN -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">9. Children's Privacy</h2>

                <p>
                    The Services are not intended for individuals who do not meet the minimum age requirements
                    established by Discord. We do not knowingly collect personal data from such individuals.
                </p>
            </section>

            <!-- LIABILITY -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">10. User Content and Responsibility</h2>

                <p>
                    The Services may allow users to upload, transmit, or process content, including through AI features.
                </p>

                <p>
                    We do not control, monitor, or verify user-provided content and expressly disclaim responsibility or
                    liability for such content.
                </p>

                <p>
                    Users are solely responsible for ensuring that any data they upload or process complies with
                    applicable laws and does not infringe on the rights of others.
                </p>
            </section>

            <!-- CHANGES -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">11. Changes to This Privacy Policy</h2>

                <p>
                    We reserve the right to update or modify this Privacy Policy at any time. Changes will be effective
                    upon posting. Continued use of the Services constitutes acceptance of the revised policy.
                </p>
            </section>

            <!-- CONTACT -->
            <section>
                <h2 class="text-2xl font-semibold mb-2">12. Contact Information</h2>

                <p>
                    If you have any questions, concerns, or requests regarding this Privacy Policy, you may contact us
                    at:
                </p>

                <ul class="list-disc ml-5">
                    <li>Email: {{ SUPPORT_EMAIL }}</li>
                    <li>Website: {{ WEBSITE_URL }}</li>
                    <li>Discord: {{ DISCORD_URL }}</li>
                </ul>
            </section>

        </div>
    </main>
</template>
