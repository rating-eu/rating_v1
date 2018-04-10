--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.12
-- Dumped by pg_dump version 9.5.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: answer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.answer (
    id bigint NOT NULL,
    jhi_type character varying(255) NOT NULL,
    name character varying(255),
    created timestamp without time zone,
    modified timestamp without time zone,
    question_id bigint
);


ALTER TABLE public.answer OWNER TO postgres;

--
-- Name: answer_attacks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.answer_attacks (
    attacks_id bigint NOT NULL,
    answers_id bigint NOT NULL
);


ALTER TABLE public.answer_attacks OWNER TO postgres;

--
-- Name: answer_threat_agents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.answer_threat_agents (
    threat_agents_id bigint NOT NULL,
    answers_id bigint NOT NULL
);


ALTER TABLE public.answer_threat_agents OWNER TO postgres;

--
-- Name: asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(2000),
    created timestamp without time zone,
    modified timestamp without time zone,
    assetcategory_id bigint
);


ALTER TABLE public.asset OWNER TO postgres;

--
-- Name: asset_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_category (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(2000),
    jhi_type character varying(255) NOT NULL
);


ALTER TABLE public.asset_category OWNER TO postgres;

--
-- Name: asset_container; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_container (
    containers_id bigint NOT NULL,
    assets_id bigint NOT NULL
);


ALTER TABLE public.asset_container OWNER TO postgres;

--
-- Name: asset_domains; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_domains (
    domains_id bigint NOT NULL,
    assets_id bigint NOT NULL
);


ALTER TABLE public.asset_domains OWNER TO postgres;

--
-- Name: attack_strategy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attack_strategy (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(2000),
    freq character varying(255) NOT NULL,
    skill character varying(255) NOT NULL,
    resources character varying(255) NOT NULL,
    likelihood character varying(255),
    jhi_level character varying(255) NOT NULL,
    phase character varying(255) NOT NULL,
    created timestamp without time zone,
    modified timestamp without time zone
);


ALTER TABLE public.attack_strategy OWNER TO postgres;

--
-- Name: attack_strategy_mitigation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attack_strategy_mitigation (
    mitigations_id bigint NOT NULL,
    attack_strategies_id bigint NOT NULL
);


ALTER TABLE public.attack_strategy_mitigation OWNER TO postgres;

--
-- Name: attack_strategy_threat_agent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attack_strategy_threat_agent (
    threat_agents_id bigint NOT NULL,
    attack_strategies_id bigint NOT NULL
);


ALTER TABLE public.attack_strategy_threat_agent OWNER TO postgres;

--
-- Name: company_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_profile (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(2000),
    created timestamp without time zone,
    modified timestamp without time zone,
    jhi_type character varying(255),
    user_id bigint
);


ALTER TABLE public.company_profile OWNER TO postgres;

--
-- Name: company_profile_container; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_profile_container (
    containers_id bigint NOT NULL,
    company_profiles_id bigint NOT NULL
);


ALTER TABLE public.company_profile_container OWNER TO postgres;

--
-- Name: company_sector; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_sector (
    id bigint NOT NULL,
    department character varying(255) NOT NULL,
    description character varying(2000),
    created timestamp without time zone,
    modified timestamp without time zone,
    user_id bigint,
    companyprofile_id bigint
);


ALTER TABLE public.company_sector OWNER TO postgres;

--
-- Name: container; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.container (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(2000),
    container_type character varying(255),
    created timestamp without time zone
);


ALTER TABLE public.container OWNER TO postgres;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO postgres;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO postgres;

--
-- Name: domain_of_influence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.domain_of_influence (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(2000)
);


ALTER TABLE public.domain_of_influence OWNER TO postgres;

--
-- Name: external_audit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.external_audit (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    user_id bigint
);


ALTER TABLE public.external_audit OWNER TO postgres;

--
-- Name: hibernate_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hibernate_sequence
    START WITH 1000
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hibernate_sequence OWNER TO postgres;

--
-- Name: jhi_authority; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jhi_authority (
    name character varying(50) NOT NULL
);


ALTER TABLE public.jhi_authority OWNER TO postgres;

--
-- Name: jhi_persistent_audit_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jhi_persistent_audit_event (
    event_id bigint NOT NULL,
    principal character varying(50) NOT NULL,
    event_date timestamp without time zone,
    event_type character varying(255)
);


ALTER TABLE public.jhi_persistent_audit_event OWNER TO postgres;

--
-- Name: jhi_persistent_audit_evt_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jhi_persistent_audit_evt_data (
    event_id bigint NOT NULL,
    name character varying(150) NOT NULL,
    value character varying(255)
);


ALTER TABLE public.jhi_persistent_audit_evt_data OWNER TO postgres;

--
-- Name: jhi_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jhi_user (
    id bigint NOT NULL,
    login character varying(50) NOT NULL,
    password_hash character varying(60),
    first_name character varying(50),
    last_name character varying(50),
    email character varying(100),
    image_url character varying(256),
    activated boolean NOT NULL,
    lang_key character varying(6),
    activation_key character varying(20),
    reset_key character varying(20),
    created_by character varying(50) NOT NULL,
    created_date timestamp without time zone NOT NULL,
    reset_date timestamp without time zone,
    last_modified_by character varying(50),
    last_modified_date timestamp without time zone
);


ALTER TABLE public.jhi_user OWNER TO postgres;

--
-- Name: jhi_user_authority; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jhi_user_authority (
    user_id bigint NOT NULL,
    authority_name character varying(50) NOT NULL
);


ALTER TABLE public.jhi_user_authority OWNER TO postgres;

--
-- Name: mitigation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mitigation (
    id bigint NOT NULL,
    name character varying(255),
    description character varying(2000),
    created timestamp without time zone,
    modified timestamp without time zone
);


ALTER TABLE public.mitigation OWNER TO postgres;

--
-- Name: motivation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.motivation (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(2000),
    created timestamp without time zone,
    modified timestamp without time zone
);


ALTER TABLE public.motivation OWNER TO postgres;

--
-- Name: question; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.question (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    created timestamp without time zone,
    modified timestamp without time zone,
    questionnaire_id bigint
);


ALTER TABLE public.question OWNER TO postgres;

--
-- Name: questionnaire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questionnaire (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    jhi_scope character varying(255) NOT NULL,
    created timestamp without time zone,
    modified timestamp without time zone
);


ALTER TABLE public.questionnaire OWNER TO postgres;

--
-- Name: self_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.self_assessment (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    created timestamp without time zone,
    modified timestamp without time zone,
    user_id bigint
);


ALTER TABLE public.self_assessment OWNER TO postgres;

--
-- Name: self_assessment_asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.self_assessment_asset (
    assets_id bigint NOT NULL,
    self_assessments_id bigint NOT NULL
);


ALTER TABLE public.self_assessment_asset OWNER TO postgres;

--
-- Name: self_assessment_attackstrategy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.self_assessment_attackstrategy (
    attackstrategies_id bigint NOT NULL,
    self_assessments_id bigint NOT NULL
);


ALTER TABLE public.self_assessment_attackstrategy OWNER TO postgres;

--
-- Name: self_assessment_companyprofiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.self_assessment_companyprofiles (
    companyprofiles_id bigint NOT NULL,
    self_assessments_id bigint NOT NULL
);


ALTER TABLE public.self_assessment_companyprofiles OWNER TO postgres;

--
-- Name: self_assessment_companysector; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.self_assessment_companysector (
    companysectors_id bigint NOT NULL,
    self_assessments_id bigint NOT NULL
);


ALTER TABLE public.self_assessment_companysector OWNER TO postgres;

--
-- Name: self_assessment_externalaudit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.self_assessment_externalaudit (
    externalaudits_id bigint NOT NULL,
    self_assessments_id bigint NOT NULL
);


ALTER TABLE public.self_assessment_externalaudit OWNER TO postgres;

--
-- Name: self_assessment_questionnaire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.self_assessment_questionnaire (
    questionnaires_id bigint NOT NULL,
    self_assessments_id bigint NOT NULL
);


ALTER TABLE public.self_assessment_questionnaire OWNER TO postgres;

--
-- Name: self_assessment_threatagent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.self_assessment_threatagent (
    threatagents_id bigint NOT NULL,
    self_assessments_id bigint NOT NULL
);


ALTER TABLE public.self_assessment_threatagent OWNER TO postgres;

--
-- Name: threat_agent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.threat_agent (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    skill_level character varying(255) NOT NULL,
    intent character varying(255) NOT NULL,
    jhi_access character varying(255) NOT NULL,
    created timestamp without time zone,
    modified timestamp without time zone
);


ALTER TABLE public.threat_agent OWNER TO postgres;

--
-- Name: threat_agent_motivation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.threat_agent_motivation (
    motivations_id bigint NOT NULL,
    threat_agents_id bigint NOT NULL
);


ALTER TABLE public.threat_agent_motivation OWNER TO postgres;

--
-- Data for Name: answer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.answer (id, jhi_type, name, created, modified, question_id) FROM stdin;
3001	YESNO	\N	\N	\N	2956
3002	YESNO	\N	\N	\N	2955
3003	YESNO	\N	\N	\N	2954
3004	YESNO	\N	\N	\N	2953
3005	YESNO	\N	\N	\N	2952
3006	YESNO	\N	\N	\N	2951
\.


--
-- Data for Name: answer_attacks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.answer_attacks (attacks_id, answers_id) FROM stdin;
\.


--
-- Data for Name: answer_threat_agents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.answer_threat_agents (threat_agents_id, answers_id) FROM stdin;
1406	3001
1405	3002
1404	3003
1403	3004
1402	3005
1401	3006
\.


--
-- Data for Name: asset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset (id, name, description, created, modified, assetcategory_id) FROM stdin;
1251	Digital supported process	\N	\N	\N	1207
1252	Non-digitised functional and interfunctional processes	\N	\N	\N	1207
1253	Continuous Learning and Training Opportunities	\N	\N	\N	1207
1254	Firm/organisation’s strategic capabilities	\N	\N	\N	\N
1255	Eco-system’s processes	\N	\N	\N	1207
1256	Royalty, Cooperation and Commercial Agreements	\N	\N	\N	1207
1257	Commercial and Stakeholders’ Network	\N	\N	\N	1207
1258	Firm’s personnel key technical and business competences	\N	\N	\N	1206
1259	Firm’s personnel soft-skills	(non-technical skills such as communication, listening, team – working, leadership etc.)	\N	\N	1206
1260	Organisational knowledge	(both explicit – shared values, procedures and good practices and tacit – habits, informal communities of practice)	\N	\N	1206
1262	Personnel trust in the organisation	\N	\N	\N	1206
1261	Personnel motivation and satisfaction	\N	\N	\N	1206
1263	Brand Reputation	\N	\N	\N	1205
1264	Reputation of managers and employees	\N	\N	\N	1204
1265	Data on personnel	\N	\N	\N	1203
1266	On-going R&D innovation projects	\N	\N	\N	1202
1267	IP in progress internally or with patents offices	\N	\N	\N	1201
\.


--
-- Data for Name: asset_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_category (id, name, description, jhi_type) FROM stdin;
1201	IPR	\N	INTANGIBLE
1202	Innovation	\N	INTANGIBLE
1203	Data	\N	INTANGIBLE
1204	Reputation	\N	INTANGIBLE
1205	Brand	\N	INTANGIBLE
1206	Key competences and human capital	\N	INTANGIBLE
1207	Organisational capital	\N	INTANGIBLE
\.


--
-- Data for Name: asset_container; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_container (containers_id, assets_id) FROM stdin;
1001	1251
1002	1251
1001	1252
1003	1252
1001	1253
1001	1254
1003	1254
1001	1255
1003	1255
1002	1256
1003	1256
1002	1257
1003	1257
1001	1258
1001	1259
1001	1260
1002	1260
1003	1260
1001	1261
1001	1262
1001	1263
1001	1264
1001	1265
1002	1265
1003	1265
1001	1266
1002	1266
1001	1267
1002	1267
1003	1267
\.


--
-- Data for Name: asset_domains; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_domains (domains_id, assets_id) FROM stdin;
1152	1251
1155	1251
1156	1251
1151	1251
1151	1252
1151	1253
1152	1254
1151	1254
1157	1254
1155	1254
1152	1255
1155	1255
1157	1255
1151	1255
1152	1260
1151	1260
1152	1261
1155	1261
1156	1261
1151	1261
1152	1262
1155	1262
1156	1262
1151	1262
1152	1263
1155	1263
1156	1263
1151	1263
1152	1264
1155	1264
1156	1264
1151	1264
1152	1265
1157	1265
1151	1265
1152	1266
1157	1266
1151	1266
1153	1267
1157	1267
1151	1267
\.


--
-- Data for Name: attack_strategy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attack_strategy (id, name, description, freq, skill, resources, likelihood, jhi_level, phase, created, modified) FROM stdin;
1451	Physical Theft	An adversary gains physical access to a system or device through theft of the item. Possession of a system or device enables a number of unique attacks to be executed and often provides the adversary with an extended timeframe for which to perform an attack. Most protections put in place to secure sensitive information can be defeated when an adversary has physical access and enough time	MEDIUM	LOW	MEDIUM	MEDIUM	PHYSICAL	WEAPONIZATION	\N	\N
1452	Dropping Unauthorized Item	An example of Dropping Unauthorized Device is the “Human Interface Device Attack” (HID) or a “USB Drive-by”. The HID attack is a scenario in which an attacker takes a programmable embedded development platform such as the Teensy 3.2 (pictured above), and an associated software package such as Peensy or the Social Engineering Toolkit (SET) and creates a USB device which when plugged into a computer will execute a pre-configured set of keystrokes to drop a malicious payload onto the target computer. The actual payloads that are dropped and executed are highly configurable and this approach will work on Linux, Windows and Mac OS X. (https://www.cyberpointllc.com/posts/cp-human-interface-device-attack.html	LOW	MEDIUM	MEDIUM	LOW_MEDIUM	PHYSICAL	DELIVERY	\N	\N
1453	Bypass Physical Security	Facilities often used layered models for physical security such as traditional locks, Electronic-based card entry systems, coupled with physical alarms. Hardware security mechanisms range from the use of computer case and cable locks as well as RFID tags for tracking computer assets. This layered approach makes it difficult for random physical security breaches to go unnoticed, but is less effective at stopping deliberate and carefully planned break-ins. Avoiding detection begins with evading building security and surveillance and methods for bypassing the electronic or physical locks which secure entry points. (CAPEC, https://capec.mitre.org/data/definitions/390.html )	MEDIUM	MEDIUM	MEDIUM	MEDIUM	PHYSICAL	EXPLOITATION	\N	\N
1454	Post-exploitation	Post-exploitation activities are the phases of operation once a victim's system has been compromised by the attacker. The value of the compromised system is determined by the value of the actual data stored in it and how an attacker may make use of it for malicious purposes. The concept of post exploitation has risen from this fact only as to how you can use the victim's compromised system's information. This phase actually deals with collecting sensitive information, documenting it, and having an idea of the configuration settings, network interfaces, and other communication channels. These may be used to maintain persistent access to the system as per the attacker's needs. The various phases of post-exploitation are as follows: Privilege escalation Lateral Movement Traffic interception/Manipulation Cleaning tracks Collecting system information and data Setting up backdooring and rootkits	MEDIUM	HIGH	MEDIUM	MEDIUM	IT	COMMANDCONTROL	\N	\N
1455	Persistence	Operating system allows logon scripts to be run whenever a specific user or users logon to a system. If adversaries can access these scripts, they may insert additional code into the logon script. This code can allow them to maintain persistence or move laterally within an enclave because it is executed every time the affected user or users logon to a computer. Modifying logon scripts can effectively bypass workstation and enclave firewalls. Depending on the access configuration of the logon scripts, either local credentials or a remote administrative account may be necessary.	MEDIUM	MEDIUM	MEDIUM	MEDIUM	IT	INSTALLATION	\N	\N
1456	Malware	The word Malware is derived from the term 'Malicious Software'. Any piece of software that performs undesirable operations such as data theft or some other type of computer compromise can be categorised as Malware. Malware is a broad term that can refer to various types of malicious programs. […] The main types of Malware, namely: Trojans, Viruses, Worms, and Spyware. The symptoms caused by these different types of malware may sometimes be similar. However, they mainly differ in the way they spread and infect systems. (ENISA, https://www.enisa.europa.eu/topics/csirts-in-europe/glossary/malware ) An adversary develops targeted malware that takes advantage of a known vulnerability in an organizational information technology environment. The malware crafted for these attacks is based specifically on information gathered about the technology environment. Successfully executing the malware enables an adversary to achieve a wide variety of negative technical impacts. (CAPEC, https://capec.mitre.org/data/definitions/542.html )	HIGH	MEDIUM	MEDIUM	MEDIUM_HIGH	IT	WEAPONIZATION	\N	\N
1457	Know Exploit	Zero-day vulnerabilities are vulnerabilities that have not been publicly disclosed and are kept private. There are several public vulnerability repositories available that allow interested parties to have easy access to information regarding known vulnerabilities. The most prominent vulnerability repositories are CVE, NVD and OVAL. CVE has established a referencing system for registering vulnerabilities called the CVE identifier (CVE-ID). CVE-IDs usually include a brief description of the security vulnerability and sometimes advisories, mitigation measures and reports. (ENISA, https://www.enisa.europa.eu/topics/csirts-in-europe/glossary/vulnerabilities-and-exploits	HIGH	MEDIUM	LOW	HIGH	IT	EXPLOITATION	\N	\N
1458	Dropping Dangerous Item	The attacker send a dangerous items, like a bomb or anthrax letter, to the target.	LOW	HIGH	HIGH	LOW	PHYSICAL	DELIVERY	\N	\N
1459	Physical Information Gathering	There are a variety of physical methods for information gathering; some require very little equipment and others involve high-tech gear to properly pull them off. The one thing these methods have in common is that they cannot be done from a remote location. You have to be on-site and in-person. This means that pretexting, the principles of influence, and other psychological factors are typically necessary to successfully utilize these methods. No one source of information is the leading method to use nor is one method alone likely to give you enough data to secure your best chances for success. Your best bet, and the route many criminals will take, is to utilize multiple methods of gathering information and then synthesize the proper attack vector for the job from that data. ( https://www.social-engineer.org/framework/information-gathering/physical-methods-of-information-gathering/ ) An example of Physical Information Gathering is the Dumpster Diving: An adversary cases an establishment and searches through trash bins, dumpsters, or areas where company information may have been accidentally discarded for information items which may be useful to the dumpster diver. The devastating nature of the items and/or information found can be anything from medical records, resumes, personal photos and emails, bank statements, account details or information about software, tech support logs and so much more. By collecting this information an adversary may be able to learn important facts about the person or organization that play a role in helping the adversary in their attack. (Capec, https://capec.mitre.org/data/definitions/406.html ) Other type of Physical Information Ghathering are: Intrusion / Roleplay PiggyBacking Shoulder Surfing	LOW	LOW	LOW	MEDIUM	PHYSICAL	RECONNAISSANCE	\N	\N
1460	DOS/Botnet	An adversary consumes the resources of a target by rapidly engaging in a large number of interactions with the target. This type of attack generally exposes a weakness in rate limiting or flow. When successful this attack prevents legitimate users from accessing the service and can cause the target to crash. This attack differs from resource depletion through leaks or allocations in that the latter attacks do not rely on the volume of requests made to the target but instead focus on manipulation of the target's operations. The key factor in a DOS/DDOS attack is the number of requests the adversary can make in a given period of time. The greater this number, the more likely an attack is to succeed against a given target. (CAPEC, https://capec.mitre.org/data/definitions/125.html )	HIGH	MEDIUM	HIGH	MEDIUM	IT	DELIVERY	\N	\N
1462	Gain a foothold	empty	MEDIUM	LOW	MEDIUM	MEDIUM	IT	RECONNAISSANCE	\N	\N
1466	Web App Attacks	Web based attacks are those that make use of web-enabled systems and services such as browsers (and their extensions), websites (including Content Management Systems), and the IT-components of web services and web applications. Examples of such attacks include web browser exploits (or their extensions), web servers and web services exploits, drive-by attacks, waterholing attacks, redirection and man-in-the-browser-attacks. This type of attack remained one of the most important threats in 201789 and is expected to stay so in the coming years, given the fact that web technologies and web components are of high importance in the digital world. Web-based attacks are very popular in combination with malware campaigns for infection, propagation or victims control purposes, banking malware being a relevant example in this sense90 . Web-based-attacks have shown a substantial increase in 2017 and are about to reach levels similar to malware (in number of detected appearances). (Enisa Threat Landscape Report 2017)	HIGH	LOW	LOW	HIGH	IT	EXPLOITATION	\N	\N
1467	Protocol Analysis & Abuse	An adversary engages in activities to decipher and/or decode protocol information for a network or application communication protocol used for transmitting information between interconnected nodes or systems on a packet-switched data network. While this type of analysis involves the analysis of a networking protocol inherently, it does not require the presence of an actual or physical network. Although certain techniques for protocol analysis benefit from manipulating live 'on-the-wire' interactions between communicating components, static or dynamic analysis techniques applied to executables as well as to device drivers, such as network interface drivers, can also be used to reveal the function and characteristics of a communication protocol implementation. Depending upon the methods used the process may involve observing, interacting, and modifying actual communications occurring between hosts. The goal of protocol analysis is to derive the data transmission syntax, as well as to extract the meaningful content, including packet or content delimiters used by the protocol. This type of analysis is often performed on closed-specification protocols, or proprietary protocols, but is also useful for analyzing publicly available specifications to determine how particular implementations deviate from published specifications. (CAPEC, https://capec.mitre.org/data/definitions/192.html )	LOW	MEDIUM	LOW	MEDIUM	IT	RECONNAISSANCE	\N	\N
1471	Impersonification	Impersonation is one of several social engineering tools used to gain access to a system or network in order to commit fraud, industrial espionage or identity theft. The social engineer \\"impersonates\\" or plays the role of someone you are likely to trust or obey convincingly enough to fool you into allowing access to your office, to information, or to your information systems. (http://www.mysecurityawareness.com/article.php?article=390&title=impersonation-hacking-humans )	MEDIUM	MEDIUM	MEDIUM	MEDIUM	HUMAN	COMMANDCONTROL	\N	\N
1473	Reverse Engineering	An adversary discovers the structure, function, and composition of an object, resource, or system by using a variety of analysis techniques to effectively determine how the analysed entity was constructed or operates. The goal of reverse engineering is often to duplicate the function, or a part of the function, of an object in order to duplicate or \\"back engineer\\" some aspect of its functioning. Reverse engineering techniques can be applied to mechanical objects, electronic devices, or software, although the methodology and techniques involved in each type of analysis differ widely. (CAPEC, https://capec.mitre.org/data/definitions/188.html )	LOW	HIGH	HIGH	LOW	IT	WEAPONIZATION	\N	\N
1476	Fuzzing	In this attack pattern, the adversary leverages fuzzing to try to identify weaknesses in the system. Fuzzing is a software security and functionality testing method that feeds randomly constructed input to the system and looks for an indication that a failure in response to that input has occurred. Fuzzing treats the system as a black box and is totally free from any preconceptions or assumptions about the system. Fuzzing can help an attacker discover certain assumptions made about user input in the system. Fuzzing gives an attacker a quick way of potentially uncovering some of these assumptions despite not necessarily knowing anything about the internals of the system. These assumptions can then be turned against the system by specially crafting user input that may allow an attacker to achieve his goals. (CAPEC, https://capec.mitre.org/data/definitions/28.html )	MEDIUM	MEDIUM	LOW	MEDIUM_HIGH	IT	RECONNAISSANCE	\N	\N
1461	Scanning/Footprinting	An adversary engages in probing and exploration activities to identify constituents and properties of the target. Footprinting is a general term to describe a variety of information gathering techniques, often used by attackers in preparation for some attack. It consists of using tools to learn as much as possible about the composition, configuration, and security mechanisms of the targeted application, system or network. Information that might be collected during a footprinting effort could include open ports, applications and their versions, network topology, and similar information. While footprinting is not intended to be damaging (although certain activities, such as network scans, can sometimes cause disruptions to vulnerable applications inadvertently) it may often pave the way for more damaging attacks. (CAPEC, https://capec.mitre.org/data/definitions/169.html )	HIGH	LOW	LOW	HIGH	IT	RECONNAISSANCE	\N	\N
1463	Manipulating Human Behavior	An adversary exploits inherent human psychological predisposition to influence a targeted individual or group to solicit information or manipulate the target into performing an action that serves the adversary's interests. Many interpersonal social engineering techniques do not involve outright deception, although they can; many are subtle ways of manipulating a target to remove barriers, make the target feel comfortable, and produce an exchange in which the target is either more likely to share information directly, or let key information slip out unintentionally. A skilled adversary uses these techniques when appropriate to produce the desired outcome. Manipulation techniques vary from the overt, such as pretending to be a supervisor to a help desk, to the subtle, such as making the target feel comfortable with the adversary's speech and thought patterns. (Capec, https://capec.mitre.org/data/definitions/416.html)	MEDIUM	MEDIUM	MEDIUM	MEDIUM	IT	DELIVERY	\N	\N
1465	Human Targeted Attack	An adversary engages an individual using any combination of social engineering methods for the purpose of extracting information. Accurate contextual and environmental queues, such as knowing important information about the target company or individual can greatly increase the success of the attack and the quality of information gathered. Authentic mimicry combined with detailed knowledge increases the success of elicitation attacks. (CAPEC, https://capec.mitre.org/data/definitions/410.html)	LOW	HIGH	HIGH	LOW	HUMAN	EXPLOITATION	\N	\N
1474	Manipulating Human Behavior	An attacker undermines the integrity of a product, software, or technology at some stage of the distribution channel. The core threat of modification or manipulation during distribution arise from the many stages of distribution, as a product may traverse multiple suppliers and integrators as the final asset is delivered. Components and services provided from a manufacturer to a supplier may be tampered with during integration or packaging. (CAPEC, https://capec.mitre.org/data/definitions/439.html )	MEDIUM	HIGH	MEDIUM	MEDIUM	IT	DELIVERY	\N	\N
1475	*SHING	*shing is a social engineering technique where an attacker masquerades as a legitimate entity with which the victim might do business in order to prompt the user to reveal some confidential information (very frequently authentication credentials) that can later be used by an attacker. Phishing is essentially a form of information gathering or \\"fishing\\" for information. (CAPEC, https://capec.mitre.org/data/definitions/98.html ) Attack patterns within this category focus on the manipulation and exploitation of people. The techniques defined by each pattern are used to convince a target into performing actions or divulging confidential information that benefit the adversary, often resulting in access to computer systems or facilities. While similar to a confidence trick or simple fraud, the term typically applies to trickery or deception for the purpose of information gathering, fraud, or computer system access. In most cases, the adversary never comes face-to-face with the victim. (CAPEC, https://capec.mitre.org/data/definitions/403.html)	HIGH	MEDIUM	MEDIUM	MEDIUM_HIGH	HUMAN	DELIVERY	\N	\N
1464	Password Guessing	In this attack, some asset (information, functionality, identity, etc.) is protected by a finite secret value. The attacker attempts to gain access to this asset by using trial-and-error to exhaustively explore all the possible secret values in the hope of finding the secret (or a value that is functionally equivalent) that will unlock the asset. Examples of secrets can include, but are not limited to, passwords, encryption keys, database lookup keys, and initial values to one-way functions. The key factor in this attack is the attackers' ability to explore the possible secret space rapidly. This, in turn, is a function of the size of the secret space and the computational power the attacker is able to bring to bear on the problem. If the attacker has modest resources and the secret space is large, the challenge facing the attacker is intractable. While the defender cannot control the resources available to an attacker, they can control the size of the secret space. Creating a large secret space involves selecting one's secret from as large a field of equally likely alternative secrets as possible and ensuring that an attacker is unable to reduce the size of this field using available clues or cryptanalysis. Doing this is more difficult than it sounds since elimination of patterns (which, in turn, would provide an attacker clues that would help them reduce the space of potential secrets) is difficult to do using deterministic machines, such as computers. Assuming a finite secret space, a brute force attack will eventually succeed. The defender must rely on making sure that the time and resources necessary to do so will exceed the value of the information. For example, a secret space that will likely take hundreds of years to explore is likely safe from raw-brute force attacks. (CAPEC, https://capec.mitre.org/data/definitions/112.html )	HIGH	LOW	LOW	HIGH	IT	EXPLOITATION	\N	\N
1468	Ransomware	Ransomware depicts a type of malware (like Viruses, Trojans, etc.) that infect the computer systems of users and manipulates the infected system in a way, that the victim can not (partially or fully) use it and the data stored on it. The victim usually shortly after receives a blackmail note by pop-up, pressing the victim to pay a ransom (hence the name) to regain full access to system and files. (ENISA, https://www.enisa.europa.eu/topics/csirts-in-europe/glossary/ransomware )	HIGH	HIGH	HIGH	MEDIUM	IT	INSTALLATION	\N	\N
1469	Device Manipulation	Attack patterns within this category focus on the adversary's ability to manipulate one or more resources in order to achieve a desired outcome. (CAPEC) An example of Device Manipulation is where an attacker install an owner device (like a Raspberry Pi or Arduino) inside a SCADA device with the aim of intercept/analyze, manipulate the data or destroy the device.	LOW	MEDIUM	MEDIUM	MEDIUM	PHYSICAL	INSTALLATION	\N	\N
1470	0-day	In the world of pirated digital goods (software, movies, music …), a pirated version is qualified as \\"Zero-Day\\" when it is available at the same time as or before the official release. Literally, the pirate version is published zero days after the public release. In the context of Information Security, the term \\"Zero-Day\\" is bandied around by the press. At heart, though, \\"Zero-Day\\" is jargon for an exploit for a vulnerability in a piece of software that is not publicly known yet, and by extension to the vulnerability itself. To further add ambiguity, active attacks against these vulnerabilities are also dubbed \\"Zero-Day\\" in the media. This seemingly simple IT security phenomenon has far reaching implications: For attackers, a Zero-Day exploit is a sure way of accessing a system; For vendors, a Zero-Day vulnerability is a serious security risk for their clients with equally serious business risks for the vendors; For users and system administrators, a Zero-Day vulnerability on a software they use is a serious security risk which requires increased caution. (ENISA, https://www.enisa.europa.eu/topics/csirts-in-europe/glossary/zero-day )	LOW	HIGH	HIGH	LOW	IT	EXPLOITATION	\N	\N
1472	OSINT	Open Source Intelligence (OSINT) is the collection and analysis of information that is gathered from public, or open, sources. OSINT is primarily used in national security, law enforcement, and business intelligence functions and is of value to analysts who use non-sensitive intelligence in answering classified, unclassified, or proprietary intelligence requirements across the previous intelligence disciplines.” (Wikipedia, https://en.wikipedia.org/wiki/Open-source_intelligence )	HIGH	LOW	LOW	HIGH	HUMAN	RECONNAISSANCE	\N	\N
\.


--
-- Data for Name: attack_strategy_mitigation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attack_strategy_mitigation (mitigations_id, attack_strategies_id) FROM stdin;
1302	1451
1304	1451
1304	1452
1306	1452
1308	1452
1303	1453
1304	1453
1313	1454
1314	1454
1301	1454
1306	1454
1309	1454
1310	1454
1311	1454
1306	1455
1306	1456
1309	1456
1310	1456
1311	1456
1313	1457
1314	1457
1316	1457
1301	1457
1321	1457
1306	1457
1310	1457
1311	1457
1305	1458
1304	1459
1323	1460
1310	1460
1311	1460
1301	1461
1310	1461
1311	1461
1316	1462
1301	1462
1308	1463
1324	1463
1325	1463
1326	1463
1301	1464
1319	1464
1320	1464
1308	1465
1324	1465
1325	1465
1326	1465
1312	1466
1316	1466
1317	1466
1318	1466
1316	1467
1318	1467
1310	1467
1315	1468
1306	1468
1309	1468
1311	1468
1301	1469
1302	1469
1313	1470
1321	1470
1322	1470
1309	1470
1302	1472
1321	1472
1308	1472
1317	1473
1307	1475
1308	1475
1312	1476
\.


--
-- Data for Name: attack_strategy_threat_agent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attack_strategy_threat_agent (threat_agents_id, attack_strategies_id) FROM stdin;
1409	1454
\.


--
-- Data for Name: company_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_profile (id, name, description, created, modified, jhi_type, user_id) FROM stdin;
2351	Engineering	\N	\N	\N	\N	1703
\.


--
-- Data for Name: company_profile_container; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_profile_container (containers_id, company_profiles_id) FROM stdin;
1001	2351
1002	2351
1003	2351
1004	2351
\.


--
-- Data for Name: company_sector; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_sector (id, department, description, created, modified, user_id, companyprofile_id) FROM stdin;
2501	HR	\N	\N	\N	1702	2351
2651	R&D 	\N	\N	\N	1704	2351
\.


--
-- Data for Name: container; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.container (id, name, description, container_type, created) FROM stdin;
1001	Human	\N	HUMAN	\N
1002	IT	\N	IT	\N
1003	Physical	\N	PHYSICAL	\N
1004	Intangible	\N	INTANGIBLE	\N
\.


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
00000000000000	jhipster	config/liquibase/changelog/00000000000000_initial_schema.xml	2018-04-10 10:55:35.522417	1	EXECUTED	7:a6235f40597a13436aa36c6d61db2269	createSequence sequenceName=hibernate_sequence		\N	3.5.3	\N	\N	3350535332
00000000000001	jhipster	config/liquibase/changelog/00000000000000_initial_schema.xml	2018-04-10 10:55:36.031876	2	EXECUTED	7:52839c39ca98b24936251e7ab4eb10bb	createTable tableName=jhi_user; createIndex indexName=idx_user_login, tableName=jhi_user; createIndex indexName=idx_user_email, tableName=jhi_user; createTable tableName=jhi_authority; createTable tableName=jhi_user_authority; addPrimaryKey tableN...		\N	3.5.3	\N	\N	3350535332
20180410085152-1	jhipster	config/liquibase/changelog/20180410085152_added_entity_CompanyProfile.xml	2018-04-10 10:55:36.166967	3	EXECUTED	7:32a9b41f53af082e3da9f50263700966	createTable tableName=company_profile; dropDefaultValue columnName=created, tableName=company_profile; dropDefaultValue columnName=modified, tableName=company_profile; createTable tableName=company_profile_container; addPrimaryKey tableName=compan...		\N	3.5.3	\N	\N	3350535332
20180410085153-1	jhipster	config/liquibase/changelog/20180410085153_added_entity_CompanySector.xml	2018-04-10 10:55:36.28287	4	EXECUTED	7:328ae0fc348fd507dd4e43f175efd95f	createTable tableName=company_sector; dropDefaultValue columnName=created, tableName=company_sector; dropDefaultValue columnName=modified, tableName=company_sector		\N	3.5.3	\N	\N	3350535332
20180410085154-1	jhipster	config/liquibase/changelog/20180410085154_added_entity_DomainOfInfluence.xml	2018-04-10 10:55:36.381407	5	EXECUTED	7:91eab608ae70f82a0034b78ebb5a1050	createTable tableName=domain_of_influence		\N	3.5.3	\N	\N	3350535332
20180410085155-1	jhipster	config/liquibase/changelog/20180410085155_added_entity_SelfAssessment.xml	2018-04-10 10:55:36.699526	6	EXECUTED	7:b1deeeaede50c678f660504a23df6991	createTable tableName=self_assessment; dropDefaultValue columnName=created, tableName=self_assessment; dropDefaultValue columnName=modified, tableName=self_assessment; createTable tableName=self_assessment_companyprofiles; addPrimaryKey tableName=...		\N	3.5.3	\N	\N	3350535332
20180410085156-1	jhipster	config/liquibase/changelog/20180410085156_added_entity_Container.xml	2018-04-10 10:55:36.798947	7	EXECUTED	7:9a11cf3f39fc3c93e091d8d53e3e2a63	createTable tableName=container; dropDefaultValue columnName=created, tableName=container		\N	3.5.3	\N	\N	3350535332
20180410085157-1	jhipster	config/liquibase/changelog/20180410085157_added_entity_AssetCategory.xml	2018-04-10 10:55:36.899067	8	EXECUTED	7:d6a39d3f93361a3b6b8c7d05bedb6d6e	createTable tableName=asset_category		\N	3.5.3	\N	\N	3350535332
20180410085158-1	jhipster	config/liquibase/changelog/20180410085158_added_entity_Asset.xml	2018-04-10 10:55:37.107706	9	EXECUTED	7:15412c27a2ce3e56a98498845166da94	createTable tableName=asset; dropDefaultValue columnName=created, tableName=asset; dropDefaultValue columnName=modified, tableName=asset; createTable tableName=asset_container; addPrimaryKey tableName=asset_container; createTable tableName=asset_d...		\N	3.5.3	\N	\N	3350535332
20180410085159-1	jhipster	config/liquibase/changelog/20180410085159_added_entity_ThreatAgent.xml	2018-04-10 10:55:37.233979	10	EXECUTED	7:d858441033acb5eddc8858144bb2f0a1	createTable tableName=threat_agent; dropDefaultValue columnName=created, tableName=threat_agent; dropDefaultValue columnName=modified, tableName=threat_agent; createTable tableName=threat_agent_motivation; addPrimaryKey tableName=threat_agent_moti...		\N	3.5.3	\N	\N	3350535332
20180410085200-1	jhipster	config/liquibase/changelog/20180410085200_added_entity_Motivation.xml	2018-04-10 10:55:37.340815	11	EXECUTED	7:ebd5fe348748ab83f075d621a5b8efc3	createTable tableName=motivation; dropDefaultValue columnName=created, tableName=motivation; dropDefaultValue columnName=modified, tableName=motivation		\N	3.5.3	\N	\N	3350535332
20180410085201-1	jhipster	config/liquibase/changelog/20180410085201_added_entity_AttackStrategy.xml	2018-04-10 10:55:37.499615	12	EXECUTED	7:51f6fbe833fdc23468269f75ee0b62c4	createTable tableName=attack_strategy; dropDefaultValue columnName=created, tableName=attack_strategy; dropDefaultValue columnName=modified, tableName=attack_strategy; createTable tableName=attack_strategy_mitigation; addPrimaryKey tableName=attac...		\N	3.5.3	\N	\N	3350535332
20180410085202-1	jhipster	config/liquibase/changelog/20180410085202_added_entity_Mitigation.xml	2018-04-10 10:55:37.591264	13	EXECUTED	7:d237a8f500f1d0327874e6ce3f574e99	createTable tableName=mitigation; dropDefaultValue columnName=created, tableName=mitigation; dropDefaultValue columnName=modified, tableName=mitigation		\N	3.5.3	\N	\N	3350535332
20180410085203-1	jhipster	config/liquibase/changelog/20180410085203_added_entity_Questionnaire.xml	2018-04-10 10:55:37.691534	14	EXECUTED	7:128d0d31f010172700b9471b84cf0b37	createTable tableName=questionnaire; dropDefaultValue columnName=created, tableName=questionnaire; dropDefaultValue columnName=modified, tableName=questionnaire		\N	3.5.3	\N	\N	3350535332
20180410085204-1	jhipster	config/liquibase/changelog/20180410085204_added_entity_Question.xml	2018-04-10 10:55:37.7498	15	EXECUTED	7:9e6580891f2843dfdf01b6a053fc74fe	createTable tableName=question; dropDefaultValue columnName=created, tableName=question; dropDefaultValue columnName=modified, tableName=question		\N	3.5.3	\N	\N	3350535332
20180410085205-1	jhipster	config/liquibase/changelog/20180410085205_added_entity_Answer.xml	2018-04-10 10:55:37.934142	16	EXECUTED	7:78c69e2b55c344788c75d0b61a5b6527	createTable tableName=answer; dropDefaultValue columnName=created, tableName=answer; dropDefaultValue columnName=modified, tableName=answer; createTable tableName=answer_threat_agents; addPrimaryKey tableName=answer_threat_agents; createTable tabl...		\N	3.5.3	\N	\N	3350535332
20180410085206-1	jhipster	config/liquibase/changelog/20180410085206_added_entity_ExternalAudit.xml	2018-04-10 10:55:38.008197	17	EXECUTED	7:576a0bb950cc681409f057c14330bedc	createTable tableName=external_audit		\N	3.5.3	\N	\N	3350535332
20180410085152-2	jhipster	config/liquibase/changelog/20180410085152_added_entity_constraints_CompanyProfile.xml	2018-04-10 10:55:38.034247	18	EXECUTED	7:65b6034c239850bcb994cd605411e31b	addForeignKeyConstraint baseTableName=company_profile, constraintName=fk_company_profile_user_id, referencedTableName=jhi_user; addForeignKeyConstraint baseTableName=company_profile_container, constraintName=fk_company_profile_container_company_pr...		\N	3.5.3	\N	\N	3350535332
20180410085153-2	jhipster	config/liquibase/changelog/20180410085153_added_entity_constraints_CompanySector.xml	2018-04-10 10:55:38.051098	19	EXECUTED	7:52bd45360fb514519f7a1c3cb2759132	addForeignKeyConstraint baseTableName=company_sector, constraintName=fk_company_sector_user_id, referencedTableName=jhi_user; addForeignKeyConstraint baseTableName=company_sector, constraintName=fk_company_sector_companyprofile_id, referencedTable...		\N	3.5.3	\N	\N	3350535332
20180410085155-2	jhipster	config/liquibase/changelog/20180410085155_added_entity_constraints_SelfAssessment.xml	2018-04-10 10:55:38.102463	20	EXECUTED	7:0f6a68ddaebc321a2c180dadc041e3fe	addForeignKeyConstraint baseTableName=self_assessment, constraintName=fk_self_assessment_user_id, referencedTableName=jhi_user; addForeignKeyConstraint baseTableName=self_assessment_companyprofiles, constraintName=fk_self_assessment_companyprofile...		\N	3.5.3	\N	\N	3350535332
20180410085158-2	jhipster	config/liquibase/changelog/20180410085158_added_entity_constraints_Asset.xml	2018-04-10 10:55:38.126358	21	EXECUTED	7:ad1b16abf9506ae4044d731e60593ca2	addForeignKeyConstraint baseTableName=asset_container, constraintName=fk_asset_container_assets_id, referencedTableName=asset; addForeignKeyConstraint baseTableName=asset_container, constraintName=fk_asset_container_containers_id, referencedTableN...		\N	3.5.3	\N	\N	3350535332
20180410085159-2	jhipster	config/liquibase/changelog/20180410085159_added_entity_constraints_ThreatAgent.xml	2018-04-10 10:55:38.151309	22	EXECUTED	7:e07d1ef8ea886049ec0f645256a85ba7	addForeignKeyConstraint baseTableName=threat_agent_motivation, constraintName=fk_threat_agent_motivation_threat_agents_id, referencedTableName=threat_agent; addForeignKeyConstraint baseTableName=threat_agent_motivation, constraintName=fk_threat_ag...		\N	3.5.3	\N	\N	3350535332
20180410085201-2	jhipster	config/liquibase/changelog/20180410085201_added_entity_constraints_AttackStrategy.xml	2018-04-10 10:55:38.176367	23	EXECUTED	7:f377479b8cb53431a24790bdd62d1e35	addForeignKeyConstraint baseTableName=attack_strategy_mitigation, constraintName=fk_attack_strategy_mitigation_attack_strategies_id, referencedTableName=attack_strategy; addForeignKeyConstraint baseTableName=attack_strategy_mitigation, constraintN...		\N	3.5.3	\N	\N	3350535332
20180410085204-2	jhipster	config/liquibase/changelog/20180410085204_added_entity_constraints_Question.xml	2018-04-10 10:55:38.192903	24	EXECUTED	7:e45d1c517632f23b90695b68eb84e528	addForeignKeyConstraint baseTableName=question, constraintName=fk_question_questionnaire_id, referencedTableName=questionnaire		\N	3.5.3	\N	\N	3350535332
20180410085205-2	jhipster	config/liquibase/changelog/20180410085205_added_entity_constraints_Answer.xml	2018-04-10 10:55:38.218397	25	EXECUTED	7:7ec37ac99b886e0410b5ccdcba5f265d	addForeignKeyConstraint baseTableName=answer_threat_agents, constraintName=fk_answer_threat_agents_answers_id, referencedTableName=answer; addForeignKeyConstraint baseTableName=answer_threat_agents, constraintName=fk_answer_threat_agents_threat_ag...		\N	3.5.3	\N	\N	3350535332
20180410085206-2	jhipster	config/liquibase/changelog/20180410085206_added_entity_constraints_ExternalAudit.xml	2018-04-10 10:55:38.234628	26	EXECUTED	7:69e5ec2201cd5dfb69deb2253d9bc7b2	addForeignKeyConstraint baseTableName=external_audit, constraintName=fk_external_audit_user_id, referencedTableName=jhi_user		\N	3.5.3	\N	\N	3350535332
\.


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
\.


--
-- Data for Name: domain_of_influence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.domain_of_influence (id, name, description) FROM stdin;
1151	Human	\N
1152	Digital Footprint	\N
1153	Physical	\N
1154	Digital Footprint (wikileaks)	\N
1155	Social Network	\N
1156	Press and Media	\N
1157	IT	\N
\.


--
-- Data for Name: external_audit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.external_audit (id, name, user_id) FROM stdin;
2001	extAuditEng	1701
\.


--
-- Name: hibernate_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hibernate_sequence', 3050, true);


--
-- Data for Name: jhi_authority; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jhi_authority (name) FROM stdin;
ROLE_ADMIN
ROLE_USER
ROLE_AUDIT
\.


--
-- Data for Name: jhi_persistent_audit_event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jhi_persistent_audit_event (event_id, principal, event_date, event_type) FROM stdin;
951	admin	2018-04-10 10:56:20.932	AUTHENTICATION_SUCCESS
1501	admin	2018-04-10 12:28:39.063	AUTHENTICATION_SUCCESS
1551	admin	2018-04-10 12:35:55.022	AUTHENTICATION_SUCCESS
1601	admin	2018-04-10 12:53:41.641	AUTHENTICATION_SUCCESS
1651	admin	2018-04-10 12:55:37.195	AUTHENTICATION_SUCCESS
1652	user	2018-04-10 13:02:48.064	AUTHENTICATION_SUCCESS
1653	hreng	2018-04-10 13:03:09.099	AUTHENTICATION_SUCCESS
1654	enguser	2018-04-10 13:05:02.594	AUTHENTICATION_SUCCESS
1655	admin	2018-04-10 13:06:01.619	AUTHENTICATION_SUCCESS
1656	enguser	2018-04-10 13:06:43.328	AUTHENTICATION_SUCCESS
1801	admin	2018-04-10 13:57:00.968	AUTHENTICATION_SUCCESS
1851	enguser	2018-04-10 14:12:56.352	AUTHENTICATION_SUCCESS
1852	hreng	2018-04-10 14:19:54.42	AUTHENTICATION_SUCCESS
1853	extaudit	2018-04-10 14:21:17.887	AUTHENTICATION_FAILURE
1854	extauditeng	2018-04-10 14:21:21.296	AUTHENTICATION_SUCCESS
1855	admin	2018-04-10 14:21:48.811	AUTHENTICATION_SUCCESS
1856	extauditeng	2018-04-10 14:22:20.389	AUTHENTICATION_SUCCESS
1857	admin	2018-04-10 14:25:49.141	AUTHENTICATION_SUCCESS
1858	enguser	2018-04-10 14:27:27.269	AUTHENTICATION_SUCCESS
2051	enguser	2018-04-10 14:35:03.434	AUTHENTICATION_SUCCESS
2101	enguser	2018-04-10 14:41:27.734	AUTHENTICATION_SUCCESS
2151	enguser	2018-04-10 14:43:50.799	AUTHENTICATION_SUCCESS
2201	enguser	2018-04-10 14:55:34.769	AUTHENTICATION_SUCCESS
2202	hreng	2018-04-10 14:56:15.867	AUTHENTICATION_SUCCESS
2203	enguser	2018-04-10 14:56:34.781	AUTHENTICATION_SUCCESS
2251	admin	2018-04-10 15:13:45.963	AUTHENTICATION_SUCCESS
2252	enguser	2018-04-10 15:14:04.402	AUTHENTICATION_SUCCESS
2253	admin	2018-04-10 15:14:39.577	AUTHENTICATION_SUCCESS
2254	enguser	2018-04-10 15:15:53.263	AUTHENTICATION_SUCCESS
2255	hreng	2018-04-10 15:16:21.236	AUTHENTICATION_SUCCESS
2256	enguser	2018-04-10 15:16:49.133	AUTHENTICATION_SUCCESS
2257	rdeng	2018-04-10 15:17:21.122	AUTHENTICATION_FAILURE
2258	rdeng	2018-04-10 15:17:25.444	AUTHENTICATION_FAILURE
2259	usereng	2018-04-10 15:17:34.517	AUTHENTICATION_FAILURE
2260	usereng	2018-04-10 15:17:39.814	AUTHENTICATION_FAILURE
2261	admin	2018-04-10 15:17:49.695	AUTHENTICATION_SUCCESS
2262	hreng	2018-04-10 15:18:17.025	AUTHENTICATION_SUCCESS
2263	admin	2018-04-10 15:19:21.506	AUTHENTICATION_SUCCESS
2264	enguser	2018-04-10 15:20:12.993	AUTHENTICATION_SUCCESS
2265	hreng	2018-04-10 15:20:43.624	AUTHENTICATION_SUCCESS
2401	enguser	2018-04-10 15:23:23.145	AUTHENTICATION_SUCCESS
2402	hreng	2018-04-10 15:23:40.832	AUTHENTICATION_SUCCESS
2451	enguser	2018-04-10 15:27:02.832	AUTHENTICATION_SUCCESS
2452	hreng	2018-04-10 15:27:28.545	AUTHENTICATION_SUCCESS
2551	enguser	2018-04-10 15:32:42.021	AUTHENTICATION_SUCCESS
2552	hreng	2018-04-10 15:32:52.963	AUTHENTICATION_SUCCESS
2553	enguser	2018-04-10 15:33:26.424	AUTHENTICATION_SUCCESS
2554	hreng	2018-04-10 15:34:06.012	AUTHENTICATION_SUCCESS
2555	enguser	2018-04-10 15:34:31.525	AUTHENTICATION_SUCCESS
2556	hreng	2018-04-10 15:36:10.186	AUTHENTICATION_SUCCESS
2557	rdeng	2018-04-10 15:36:31.743	AUTHENTICATION_FAILURE
2558	enguser	2018-04-10 15:36:51.599	AUTHENTICATION_SUCCESS
2559	enguser	2018-04-10 15:41:07.696	AUTHENTICATION_SUCCESS
2560	admin	2018-04-10 15:41:57.652	AUTHENTICATION_SUCCESS
2561	enguser	2018-04-10 15:42:36.348	AUTHENTICATION_SUCCESS
2562	hreng	2018-04-10 15:44:44.338	AUTHENTICATION_SUCCESS
2701	enguser	2018-04-10 15:49:14.368	AUTHENTICATION_SUCCESS
2702	hreng	2018-04-10 15:49:33.603	AUTHENTICATION_SUCCESS
2703	enguser	2018-04-10 15:52:17.042	AUTHENTICATION_SUCCESS
2751	enguser	2018-04-10 15:54:12.191	AUTHENTICATION_SUCCESS
2752	hreng	2018-04-10 15:54:43.112	AUTHENTICATION_SUCCESS
2801	enguser	2018-04-10 15:57:33.222	AUTHENTICATION_SUCCESS
2802	hreng	2018-04-10 15:57:53.82	AUTHENTICATION_SUCCESS
2851	admin	2018-04-10 16:15:38.224	AUTHENTICATION_SUCCESS
\.


--
-- Data for Name: jhi_persistent_audit_evt_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jhi_persistent_audit_evt_data (event_id, name, value) FROM stdin;
1853	type	org.springframework.security.authentication.BadCredentialsException
1853	message	Bad credentials
2257	type	org.springframework.security.authentication.BadCredentialsException
2257	message	Bad credentials
2258	type	org.springframework.security.authentication.BadCredentialsException
2258	message	Bad credentials
2259	type	org.springframework.security.authentication.BadCredentialsException
2259	message	Bad credentials
2260	type	org.springframework.security.authentication.BadCredentialsException
2260	message	Bad credentials
2557	type	org.springframework.security.authentication.BadCredentialsException
2557	message	Bad credentials
\.


--
-- Data for Name: jhi_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jhi_user (id, login, password_hash, first_name, last_name, email, image_url, activated, lang_key, activation_key, reset_key, created_by, created_date, reset_date, last_modified_by, last_modified_date) FROM stdin;
1	system	$2a$10$mE.qmcV0mFU5NcKh73TZx.z4ueI/.bDWbj0T1BYyqP481kGGarKLG	System	System	system@localhost		t	en	\N	\N	system	2018-04-10 10:55:35.539646	\N	system	\N
2	anonymoususer	$2a$10$j8S5d7Sr7.8VTOYNviDPOeWX8KcYILUVJBsYV83Y5NtECayypx9lO	Anonymous	User	anonymous@localhost		t	en	\N	\N	system	2018-04-10 10:55:35.539646	\N	system	\N
3	admin	$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC	Administrator	Administrator	admin@localhost		t	en	\N	\N	system	2018-04-10 10:55:35.539646	\N	system	\N
4	user	$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K	User	User	user@localhost		t	en	\N	\N	system	2018-04-10 10:55:35	\N	system	\N
1701	extauditeng	$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K	external	audit	napolitano.v@gmail.com	\N	t	en	\N	73288277062746112533	admin	2018-04-10 12:56:12	2018-04-10 12:56:12	admin	2018-04-10 12:56:12
1702	hreng	$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K	HR	Eng	hr_hermeneut@eng.it	\N	t	en	\N	24325553988307028663	admin	2018-04-10 12:57:15	2018-04-10 12:57:15	admin	2018-04-10 12:57:15
1703	enguser	$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K	user	user	enguser_hermeneut@eng.it	\N	t	en	\N	52335205955857375012	admin	2018-04-10 12:57:45	2018-04-10 12:57:45	admin	2018-04-10 12:57:45
1704	rdeng	$2a$10$ePb1Q9UfNPU4BrNeecQvD.mHtSSKT9aDI73wQUDFtYI/YGHu4rL5.	rd	rd	rdeng_hermeneut@eng.it	\N	t	en	\N	27387828570752095848	admin	2018-04-10 13:06:33.024	2018-04-10 13:06:33.023	admin	2018-04-10 13:06:33.024
\.


--
-- Data for Name: jhi_user_authority; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jhi_user_authority (user_id, authority_name) FROM stdin;
1	ROLE_ADMIN
1	ROLE_USER
3	ROLE_ADMIN
3	ROLE_USER
4	ROLE_USER
1701	ROLE_AUDIT
1702	ROLE_USER
1703	ROLE_USER
1704	ROLE_USER
1701	ROLE_USER
\.


--
-- Data for Name: mitigation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mitigation (id, name, description, created, modified) FROM stdin;
1301	Hardening	\N	\N	\N
1302	Data Encription	\N	\N	\N
1303	Physical Access Controll	\N	\N	\N
1304	Surveillance	\N	\N	\N
1305	DR	\N	\N	\N
1306	Antivirus	\N	\N	\N
1307	Anti-Spam	\N	\N	\N
1308	Awareness	\N	\N	\N
1309	Soc	\N	\N	\N
1310	IDS/IPS	\N	\N	\N
1311	Firewall/UTM	\N	\N	\N
1312	Web Application Firewall	\N	\N	\N
1313	SIEM	\N	\N	\N
1314	Patching	\N	\N	\N
1315	Backup	\N	\N	\N
1316	VA/Pentest	\N	\N	\N
1317	Secure Coding	\N	\N	\N
1318	Secure Network Protocol	\N	\N	\N
1319	IAM/Sso	\N	\N	\N
1320	Strong Authentication	\N	\N	\N
1321	Early Warning / Thread Intelligence	\N	\N	\N
1322	Advanced Behavior Detection	\N	\N	\N
1323	ISP DOS Protection	\N	\N	\N
1324	DLP	\N	\N	\N
1325	Data classification	\N	\N	\N
1326	Security policy framework	\N	\N	\N
\.


--
-- Data for Name: motivation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.motivation (id, name, description, created, modified) FROM stdin;
1351	Dominance	\N	\N	\N
1352	Organizational Gain	\N	\N	\N
1353	Disgruntlement	\N	\N	\N
1354	Ideology	\N	\N	\N
1355	Personal Financial Gain	\N	\N	\N
1356	Notoriety	\N	\N	\N
1357	Personal Satisfaction	\N	\N	\N
1358	Coercion	\N	\N	\N
1359	Accidental	\N	\N	\N
1360	Unpredictable	\N	\N	\N
\.


--
-- Data for Name: question; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.question (id, name, created, modified, questionnaire_id) FROM stdin;
2951	Does your company manage relevant/important data?​	\N	\N	2901
2952	Is your company a potential target for political, ethnical, religious or environmental reasons?​	\N	\N	2901
2953	Does your company operate in a war zone?​	\N	\N	2901
2954	Does your company manage relevant data that could be easily resold to competitors or in black markets?​	\N	\N	2901
2955	Does your company has industrial secrets or intellectual properties?​	\N	\N	2901
2956	Does your employee manage assets that could be easily resold to competitors or on black markets?​	\N	\N	2901
\.


--
-- Data for Name: questionnaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questionnaire (id, name, jhi_scope, created, modified) FROM stdin;
2901	Who would attack my company?	ID_THREAT_AGENT	\N	\N
2902	Which are the weackness of my company?	SELFASSESSMENT	\N	\N
\.


--
-- Data for Name: self_assessment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.self_assessment (id, name, created, modified, user_id) FROM stdin;
2601	hr eng self assessment	\N	\N	1702
2602	R&D eng self Assessment	\N	\N	1704
\.


--
-- Data for Name: self_assessment_asset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.self_assessment_asset (assets_id, self_assessments_id) FROM stdin;
\.


--
-- Data for Name: self_assessment_attackstrategy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.self_assessment_attackstrategy (attackstrategies_id, self_assessments_id) FROM stdin;
\.


--
-- Data for Name: self_assessment_companyprofiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.self_assessment_companyprofiles (companyprofiles_id, self_assessments_id) FROM stdin;
2351	2601
2351	2602
\.


--
-- Data for Name: self_assessment_companysector; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.self_assessment_companysector (companysectors_id, self_assessments_id) FROM stdin;
2501	2601
2651	2602
\.


--
-- Data for Name: self_assessment_externalaudit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.self_assessment_externalaudit (externalaudits_id, self_assessments_id) FROM stdin;
\.


--
-- Data for Name: self_assessment_questionnaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.self_assessment_questionnaire (questionnaires_id, self_assessments_id) FROM stdin;
\.


--
-- Data for Name: self_assessment_threatagent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.self_assessment_threatagent (threatagents_id, self_assessments_id) FROM stdin;
\.


--
-- Data for Name: threat_agent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.threat_agent (id, name, skill_level, intent, jhi_access, created, modified) FROM stdin;
1401	Governament Hacker	HIGH	HOSTILE	BOTH	\N	\N
1402	Hacktivist	HIGH	HOSTILE	OUTSIDER	\N	\N
1403	Terrorist	HIGH	HOSTILE	OUTSIDER	\N	\N
1404	Hacker	HIGH	HOSTILE	BOTH	\N	\N
1405	Competitor/ Hireling Hacker	MEDIUM	HOSTILE	OUTSIDER	\N	\N
1406	Insider	MEDIUM	HOSTILE	INSIDER	\N	\N
1407	Script Kiddie	LOW	HOSTILE	OUTSIDER	\N	\N
1408	Unpredictable Person	LOW	HOSTILE	BOTH	\N	\N
1409	Unaware	LOW	NOHOSTILE	INSIDER	\N	\N
\.


--
-- Data for Name: threat_agent_motivation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.threat_agent_motivation (motivations_id, threat_agents_id) FROM stdin;
1351	1401
1352	1401
1351	1402
1354	1402
1351	1403
1353	1403
1354	1403
1351	1404
1352	1404
1355	1404
1356	1404
1357	1404
1351	1405
1352	1405
1355	1405
1355	1406
1358	1406
1351	1407
1356	1407
1357	1407
1360	1408
1355	1408
1358	1409
1359	1409
\.


--
-- Name: answer_attacks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_attacks
    ADD CONSTRAINT answer_attacks_pkey PRIMARY KEY (answers_id, attacks_id);


--
-- Name: answer_threat_agents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_threat_agents
    ADD CONSTRAINT answer_threat_agents_pkey PRIMARY KEY (answers_id, threat_agents_id);


--
-- Name: asset_container_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_container
    ADD CONSTRAINT asset_container_pkey PRIMARY KEY (assets_id, containers_id);


--
-- Name: asset_domains_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_domains
    ADD CONSTRAINT asset_domains_pkey PRIMARY KEY (assets_id, domains_id);


--
-- Name: attack_strategy_mitigation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attack_strategy_mitigation
    ADD CONSTRAINT attack_strategy_mitigation_pkey PRIMARY KEY (attack_strategies_id, mitigations_id);


--
-- Name: attack_strategy_threat_agent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attack_strategy_threat_agent
    ADD CONSTRAINT attack_strategy_threat_agent_pkey PRIMARY KEY (attack_strategies_id, threat_agents_id);


--
-- Name: company_profile_container_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_profile_container
    ADD CONSTRAINT company_profile_container_pkey PRIMARY KEY (company_profiles_id, containers_id);


--
-- Name: jhi_persistent_audit_evt_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jhi_persistent_audit_evt_data
    ADD CONSTRAINT jhi_persistent_audit_evt_data_pkey PRIMARY KEY (event_id, name);


--
-- Name: jhi_user_authority_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jhi_user_authority
    ADD CONSTRAINT jhi_user_authority_pkey PRIMARY KEY (user_id, authority_name);


--
-- Name: pk_answer; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT pk_answer PRIMARY KEY (id);


--
-- Name: pk_asset; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT pk_asset PRIMARY KEY (id);


--
-- Name: pk_asset_category; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_category
    ADD CONSTRAINT pk_asset_category PRIMARY KEY (id);


--
-- Name: pk_attack_strategy; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attack_strategy
    ADD CONSTRAINT pk_attack_strategy PRIMARY KEY (id);


--
-- Name: pk_company_profile; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_profile
    ADD CONSTRAINT pk_company_profile PRIMARY KEY (id);


--
-- Name: pk_company_sector; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_sector
    ADD CONSTRAINT pk_company_sector PRIMARY KEY (id);


--
-- Name: pk_container; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.container
    ADD CONSTRAINT pk_container PRIMARY KEY (id);


--
-- Name: pk_databasechangeloglock; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT pk_databasechangeloglock PRIMARY KEY (id);


--
-- Name: pk_domain_of_influence; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domain_of_influence
    ADD CONSTRAINT pk_domain_of_influence PRIMARY KEY (id);


--
-- Name: pk_external_audit; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.external_audit
    ADD CONSTRAINT pk_external_audit PRIMARY KEY (id);


--
-- Name: pk_jhi_authority; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jhi_authority
    ADD CONSTRAINT pk_jhi_authority PRIMARY KEY (name);


--
-- Name: pk_jhi_persistent_audit_event; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jhi_persistent_audit_event
    ADD CONSTRAINT pk_jhi_persistent_audit_event PRIMARY KEY (event_id);


--
-- Name: pk_jhi_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jhi_user
    ADD CONSTRAINT pk_jhi_user PRIMARY KEY (id);


--
-- Name: pk_mitigation; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitigation
    ADD CONSTRAINT pk_mitigation PRIMARY KEY (id);


--
-- Name: pk_motivation; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motivation
    ADD CONSTRAINT pk_motivation PRIMARY KEY (id);


--
-- Name: pk_question; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT pk_question PRIMARY KEY (id);


--
-- Name: pk_questionnaire; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionnaire
    ADD CONSTRAINT pk_questionnaire PRIMARY KEY (id);


--
-- Name: pk_self_assessment; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment
    ADD CONSTRAINT pk_self_assessment PRIMARY KEY (id);


--
-- Name: pk_threat_agent; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.threat_agent
    ADD CONSTRAINT pk_threat_agent PRIMARY KEY (id);


--
-- Name: self_assessment_asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_asset
    ADD CONSTRAINT self_assessment_asset_pkey PRIMARY KEY (self_assessments_id, assets_id);


--
-- Name: self_assessment_attackstrategy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_attackstrategy
    ADD CONSTRAINT self_assessment_attackstrategy_pkey PRIMARY KEY (self_assessments_id, attackstrategies_id);


--
-- Name: self_assessment_companyprofiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_companyprofiles
    ADD CONSTRAINT self_assessment_companyprofiles_pkey PRIMARY KEY (self_assessments_id, companyprofiles_id);


--
-- Name: self_assessment_companysector_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_companysector
    ADD CONSTRAINT self_assessment_companysector_pkey PRIMARY KEY (self_assessments_id, companysectors_id);


--
-- Name: self_assessment_externalaudit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_externalaudit
    ADD CONSTRAINT self_assessment_externalaudit_pkey PRIMARY KEY (self_assessments_id, externalaudits_id);


--
-- Name: self_assessment_questionnaire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_questionnaire
    ADD CONSTRAINT self_assessment_questionnaire_pkey PRIMARY KEY (self_assessments_id, questionnaires_id);


--
-- Name: self_assessment_threatagent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_threatagent
    ADD CONSTRAINT self_assessment_threatagent_pkey PRIMARY KEY (self_assessments_id, threatagents_id);


--
-- Name: threat_agent_motivation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.threat_agent_motivation
    ADD CONSTRAINT threat_agent_motivation_pkey PRIMARY KEY (threat_agents_id, motivations_id);


--
-- Name: ux_user_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jhi_user
    ADD CONSTRAINT ux_user_email UNIQUE (email);


--
-- Name: ux_user_login; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jhi_user
    ADD CONSTRAINT ux_user_login UNIQUE (login);


--
-- Name: idx_persistent_audit_event; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_persistent_audit_event ON public.jhi_persistent_audit_event USING btree (principal, event_date);


--
-- Name: idx_persistent_audit_evt_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_persistent_audit_evt_data ON public.jhi_persistent_audit_evt_data USING btree (event_id);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_user_email ON public.jhi_user USING btree (email);


--
-- Name: idx_user_login; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_user_login ON public.jhi_user USING btree (login);


--
-- Name: fk_answer_attacks_answers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_attacks
    ADD CONSTRAINT fk_answer_attacks_answers_id FOREIGN KEY (answers_id) REFERENCES public.answer(id);


--
-- Name: fk_answer_attacks_attacks_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_attacks
    ADD CONSTRAINT fk_answer_attacks_attacks_id FOREIGN KEY (attacks_id) REFERENCES public.attack_strategy(id);


--
-- Name: fk_answer_question_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT fk_answer_question_id FOREIGN KEY (question_id) REFERENCES public.question(id);


--
-- Name: fk_answer_threat_agents_answers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_threat_agents
    ADD CONSTRAINT fk_answer_threat_agents_answers_id FOREIGN KEY (answers_id) REFERENCES public.answer(id);


--
-- Name: fk_answer_threat_agents_threat_agents_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_threat_agents
    ADD CONSTRAINT fk_answer_threat_agents_threat_agents_id FOREIGN KEY (threat_agents_id) REFERENCES public.threat_agent(id);


--
-- Name: fk_asset_assetcategory_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT fk_asset_assetcategory_id FOREIGN KEY (assetcategory_id) REFERENCES public.asset_category(id);


--
-- Name: fk_asset_container_assets_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_container
    ADD CONSTRAINT fk_asset_container_assets_id FOREIGN KEY (assets_id) REFERENCES public.asset(id);


--
-- Name: fk_asset_container_containers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_container
    ADD CONSTRAINT fk_asset_container_containers_id FOREIGN KEY (containers_id) REFERENCES public.container(id);


--
-- Name: fk_asset_domains_assets_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_domains
    ADD CONSTRAINT fk_asset_domains_assets_id FOREIGN KEY (assets_id) REFERENCES public.asset(id);


--
-- Name: fk_asset_domains_domains_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_domains
    ADD CONSTRAINT fk_asset_domains_domains_id FOREIGN KEY (domains_id) REFERENCES public.domain_of_influence(id);


--
-- Name: fk_attack_strategy_mitigation_attack_strategies_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attack_strategy_mitigation
    ADD CONSTRAINT fk_attack_strategy_mitigation_attack_strategies_id FOREIGN KEY (attack_strategies_id) REFERENCES public.attack_strategy(id);


--
-- Name: fk_attack_strategy_mitigation_mitigations_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attack_strategy_mitigation
    ADD CONSTRAINT fk_attack_strategy_mitigation_mitigations_id FOREIGN KEY (mitigations_id) REFERENCES public.mitigation(id);


--
-- Name: fk_attack_strategy_threat_agent_attack_strategies_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attack_strategy_threat_agent
    ADD CONSTRAINT fk_attack_strategy_threat_agent_attack_strategies_id FOREIGN KEY (attack_strategies_id) REFERENCES public.attack_strategy(id);


--
-- Name: fk_attack_strategy_threat_agent_threat_agents_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attack_strategy_threat_agent
    ADD CONSTRAINT fk_attack_strategy_threat_agent_threat_agents_id FOREIGN KEY (threat_agents_id) REFERENCES public.threat_agent(id);


--
-- Name: fk_authority_name; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jhi_user_authority
    ADD CONSTRAINT fk_authority_name FOREIGN KEY (authority_name) REFERENCES public.jhi_authority(name);


--
-- Name: fk_company_profile_container_company_profiles_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_profile_container
    ADD CONSTRAINT fk_company_profile_container_company_profiles_id FOREIGN KEY (company_profiles_id) REFERENCES public.company_profile(id);


--
-- Name: fk_company_profile_container_containers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_profile_container
    ADD CONSTRAINT fk_company_profile_container_containers_id FOREIGN KEY (containers_id) REFERENCES public.container(id);


--
-- Name: fk_company_profile_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_profile
    ADD CONSTRAINT fk_company_profile_user_id FOREIGN KEY (user_id) REFERENCES public.jhi_user(id);


--
-- Name: fk_company_sector_companyprofile_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_sector
    ADD CONSTRAINT fk_company_sector_companyprofile_id FOREIGN KEY (companyprofile_id) REFERENCES public.company_profile(id);


--
-- Name: fk_company_sector_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_sector
    ADD CONSTRAINT fk_company_sector_user_id FOREIGN KEY (user_id) REFERENCES public.jhi_user(id);


--
-- Name: fk_evt_pers_audit_evt_data; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jhi_persistent_audit_evt_data
    ADD CONSTRAINT fk_evt_pers_audit_evt_data FOREIGN KEY (event_id) REFERENCES public.jhi_persistent_audit_event(event_id);


--
-- Name: fk_external_audit_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.external_audit
    ADD CONSTRAINT fk_external_audit_user_id FOREIGN KEY (user_id) REFERENCES public.jhi_user(id);


--
-- Name: fk_question_questionnaire_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT fk_question_questionnaire_id FOREIGN KEY (questionnaire_id) REFERENCES public.questionnaire(id);


--
-- Name: fk_self_assessment_asset_assets_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_asset
    ADD CONSTRAINT fk_self_assessment_asset_assets_id FOREIGN KEY (assets_id) REFERENCES public.asset(id);


--
-- Name: fk_self_assessment_asset_self_assessments_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_asset
    ADD CONSTRAINT fk_self_assessment_asset_self_assessments_id FOREIGN KEY (self_assessments_id) REFERENCES public.self_assessment(id);


--
-- Name: fk_self_assessment_attackstrategy_attackstrategies_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_attackstrategy
    ADD CONSTRAINT fk_self_assessment_attackstrategy_attackstrategies_id FOREIGN KEY (attackstrategies_id) REFERENCES public.attack_strategy(id);


--
-- Name: fk_self_assessment_attackstrategy_self_assessments_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_attackstrategy
    ADD CONSTRAINT fk_self_assessment_attackstrategy_self_assessments_id FOREIGN KEY (self_assessments_id) REFERENCES public.self_assessment(id);


--
-- Name: fk_self_assessment_companyprofiles_companyprofiles_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_companyprofiles
    ADD CONSTRAINT fk_self_assessment_companyprofiles_companyprofiles_id FOREIGN KEY (companyprofiles_id) REFERENCES public.company_profile(id);


--
-- Name: fk_self_assessment_companyprofiles_self_assessments_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_companyprofiles
    ADD CONSTRAINT fk_self_assessment_companyprofiles_self_assessments_id FOREIGN KEY (self_assessments_id) REFERENCES public.self_assessment(id);


--
-- Name: fk_self_assessment_companysector_companysectors_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_companysector
    ADD CONSTRAINT fk_self_assessment_companysector_companysectors_id FOREIGN KEY (companysectors_id) REFERENCES public.company_sector(id);


--
-- Name: fk_self_assessment_companysector_self_assessments_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_companysector
    ADD CONSTRAINT fk_self_assessment_companysector_self_assessments_id FOREIGN KEY (self_assessments_id) REFERENCES public.self_assessment(id);


--
-- Name: fk_self_assessment_externalaudit_externalaudits_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_externalaudit
    ADD CONSTRAINT fk_self_assessment_externalaudit_externalaudits_id FOREIGN KEY (externalaudits_id) REFERENCES public.external_audit(id);


--
-- Name: fk_self_assessment_externalaudit_self_assessments_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_externalaudit
    ADD CONSTRAINT fk_self_assessment_externalaudit_self_assessments_id FOREIGN KEY (self_assessments_id) REFERENCES public.self_assessment(id);


--
-- Name: fk_self_assessment_questionnaire_questionnaires_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_questionnaire
    ADD CONSTRAINT fk_self_assessment_questionnaire_questionnaires_id FOREIGN KEY (questionnaires_id) REFERENCES public.questionnaire(id);


--
-- Name: fk_self_assessment_questionnaire_self_assessments_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_questionnaire
    ADD CONSTRAINT fk_self_assessment_questionnaire_self_assessments_id FOREIGN KEY (self_assessments_id) REFERENCES public.self_assessment(id);


--
-- Name: fk_self_assessment_threatagent_self_assessments_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_threatagent
    ADD CONSTRAINT fk_self_assessment_threatagent_self_assessments_id FOREIGN KEY (self_assessments_id) REFERENCES public.self_assessment(id);


--
-- Name: fk_self_assessment_threatagent_threatagents_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment_threatagent
    ADD CONSTRAINT fk_self_assessment_threatagent_threatagents_id FOREIGN KEY (threatagents_id) REFERENCES public.threat_agent(id);


--
-- Name: fk_self_assessment_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.self_assessment
    ADD CONSTRAINT fk_self_assessment_user_id FOREIGN KEY (user_id) REFERENCES public.jhi_user(id);


--
-- Name: fk_threat_agent_motivation_motivations_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.threat_agent_motivation
    ADD CONSTRAINT fk_threat_agent_motivation_motivations_id FOREIGN KEY (motivations_id) REFERENCES public.motivation(id);


--
-- Name: fk_threat_agent_motivation_threat_agents_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.threat_agent_motivation
    ADD CONSTRAINT fk_threat_agent_motivation_threat_agents_id FOREIGN KEY (threat_agents_id) REFERENCES public.threat_agent(id);


--
-- Name: fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jhi_user_authority
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.jhi_user(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

