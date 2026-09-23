# Security Policy

## Zero-Snoop Guarantee & Codebase Privacy

AgentSponsor is engineered with strict privacy boundaries:
1. **Zero Access to Prompts**: The plugin does not read or transmit your LLM prompts, queries, or user input.
2. **Zero Access to Source Code**: Workspace files, directories, git diffs, and project files are never inspected or uploaded.
3. **Zero Access to Model Traces**: Model internal thoughts, chain-of-thought tokens, and agent reasoning streams are completely inaccessible to the plugin.
4. **Fail-Open Safety**: Any network or runtime error causes the status line to fail open silently without blocking CLI operations.
5. **Private Distribution**: Consumers download release archives directly through cryptographic checksum validation without accessing the private git repository.

---

## Reporting Security Issues

We take the security and integrity of AgentSponsor seriously. If you discover a vulnerability or potential security concern, please disclose it responsibly.

Please email vulnerability reports directly to:
`security@agentsponsor.com`

Please include:
- Description of the vulnerability and attack vector
- Reproduction steps or proof of concept
- Affected versions, endpoints, or scripts
- Assessment of potential impact

We will acknowledge receipt within 24 hours and provide tracking updates throughout remediation.
