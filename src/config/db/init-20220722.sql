--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: trigger_set_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.trigger_set_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    source_url character varying(255) NOT NULL,
    source_name character varying(64),
    title character varying(128),
    description character varying(255),
    image character varying(255),
    author character varying(64),
    published timestamp with time zone,
    ttr integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    file_path character varying(128) NOT NULL
);


ALTER TABLE public.articles OWNER TO postgres;

--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articles_id_seq OWNER TO postgres;

--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: articles set_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: TABLE articles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.articles TO tandain_admin;


--
-- Name: SEQUENCE articles_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.articles_id_seq TO tandain_admin;


--
-- PostgreSQL database dump complete
--

