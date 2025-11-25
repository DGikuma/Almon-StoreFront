--
-- PostgreSQL database dump
--

\restrict KSG2jKOu41klSoz0F76oGPhG94fZ1WdXnYadWdQUnVLG9xCkfskThPa7eShdwAo

-- Dumped from database version 17.5 (aa1f746)
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-24 09:56:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3608 (class 1262 OID 16391)
-- Name: neondb; Type: DATABASE; Schema: -; Owner: neondb_owner
--

CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = builtin LOCALE = 'C.UTF-8' BUILTIN_LOCALE = 'C.UTF-8';


ALTER DATABASE neondb OWNER TO neondb_owner;

\unrestrict KSG2jKOu41klSoz0F76oGPhG94fZ1WdXnYadWdQUnVLG9xCkfskThPa7eShdwAo
\connect neondb
\restrict KSG2jKOu41klSoz0F76oGPhG94fZ1WdXnYadWdQUnVLG9xCkfskThPa7eShdwAo

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 16486)
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA neon_auth;


ALTER SCHEMA neon_auth OWNER TO neondb_owner;

--
-- TOC entry 2 (class 3079 OID 16500)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16487)
-- Name: users_sync; Type: TABLE; Schema: neon_auth; Owner: neondb_owner
--

CREATE TABLE neon_auth.users_sync (
    raw_json jsonb NOT NULL,
    id text GENERATED ALWAYS AS ((raw_json ->> 'id'::text)) STORED NOT NULL,
    name text GENERATED ALWAYS AS ((raw_json ->> 'display_name'::text)) STORED,
    email text GENERATED ALWAYS AS ((raw_json ->> 'primary_email'::text)) STORED,
    created_at timestamp with time zone GENERATED ALWAYS AS (to_timestamp((trunc((((raw_json ->> 'signed_up_at_millis'::text))::bigint)::double precision) / (1000)::double precision))) STORED,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE neon_auth.users_sync OWNER TO neondb_owner;

--
-- TOC entry 222 (class 1259 OID 16520)
-- Name: categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.categories OWNER TO neondb_owner;

--
-- TOC entry 242 (class 1259 OID 16716)
-- Name: conversion_recipes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.conversion_recipes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    yield_quantity integer DEFAULT 1 NOT NULL,
    loss_rate_percentage numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "fromProductId" character varying NOT NULL,
    "toProductId" character varying NOT NULL
);


ALTER TABLE public.conversion_recipes OWNER TO neondb_owner;

--
-- TOC entry 224 (class 1259 OID 16543)
-- Name: conversions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.conversions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    conversion_factor numeric(10,2),
    from_unit character varying NOT NULL,
    to_unit character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "productId" character varying
);


ALTER TABLE public.conversions OWNER TO neondb_owner;

--
-- TOC entry 230 (class 1259 OID 16606)
-- Name: delivered_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.delivered_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    "deliveryId" uuid,
    "productId" character varying
);


ALTER TABLE public.delivered_items OWNER TO neondb_owner;

--
-- TOC entry 223 (class 1259 OID 16532)
-- Name: discounts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.discounts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    percentage numeric(5,2),
    flat_amount numeric(10,2),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "productId" character varying
);


ALTER TABLE public.discounts OWNER TO neondb_owner;

--
-- TOC entry 235 (class 1259 OID 16660)
-- Name: inventory; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory (
    id character varying NOT NULL,
    quantity integer NOT NULL,
    remarks text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    "storeId" character varying,
    "productId" character varying,
    "addedById" character varying
);


ALTER TABLE public.inventory OWNER TO neondb_owner;

--
-- TOC entry 243 (class 1259 OID 16728)
-- Name: inventory_conversions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory_conversions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    input_quantity integer NOT NULL,
    output_quantity integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    "storeId" character varying NOT NULL,
    "fromProductId" character varying NOT NULL,
    "toProductId" character varying NOT NULL,
    "performedById" character varying
);


ALTER TABLE public.inventory_conversions OWNER TO neondb_owner;

--
-- TOC entry 221 (class 1259 OID 16512)
-- Name: migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO neondb_owner;

--
-- TOC entry 220 (class 1259 OID 16511)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 220
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 229 (class 1259 OID 16595)
-- Name: payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payments (
    id character varying NOT NULL,
    payment_method character varying DEFAULT 'cash'::character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    mpesa_checkout_request_id character varying,
    mpesa_receipt_number character varying,
    mpesa_phone_number character varying,
    mpesa_merchant_request_id character varying,
    card_transaction_id character varying,
    card_holder_name character varying,
    card_last4 character varying,
    card_transaction_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "saleId" character varying
);


ALTER TABLE public.payments OWNER TO neondb_owner;

--
-- TOC entry 225 (class 1259 OID 16553)
-- Name: products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.products (
    id character varying NOT NULL,
    sku character varying NOT NULL,
    name character varying NOT NULL,
    image_url character varying,
    price numeric(10,2) NOT NULL,
    vat_percentage integer,
    base_unit character varying DEFAULT 'pcs'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "categoryId" uuid
);


ALTER TABLE public.products OWNER TO neondb_owner;

--
-- TOC entry 236 (class 1259 OID 16668)
-- Name: reserved_inventory_ids; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reserved_inventory_ids (
    inventory_id character varying NOT NULL,
    used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reserved_inventory_ids OWNER TO neondb_owner;

--
-- TOC entry 237 (class 1259 OID 16676)
-- Name: reserved_payment_ids; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reserved_payment_ids (
    payment_id character varying NOT NULL,
    used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reserved_payment_ids OWNER TO neondb_owner;

--
-- TOC entry 239 (class 1259 OID 16692)
-- Name: reserved_product_ids; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reserved_product_ids (
    product_id character varying NOT NULL,
    used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reserved_product_ids OWNER TO neondb_owner;

--
-- TOC entry 238 (class 1259 OID 16684)
-- Name: reserved_sale_ids; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reserved_sale_ids (
    sale_id character varying NOT NULL,
    used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reserved_sale_ids OWNER TO neondb_owner;

--
-- TOC entry 241 (class 1259 OID 16708)
-- Name: reserved_store_ids; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reserved_store_ids (
    store_id character varying NOT NULL,
    used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reserved_store_ids OWNER TO neondb_owner;

--
-- TOC entry 240 (class 1259 OID 16700)
-- Name: reserved_user_ids; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reserved_user_ids (
    user_id character varying NOT NULL,
    used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reserved_user_ids OWNER TO neondb_owner;

--
-- TOC entry 231 (class 1259 OID 16614)
-- Name: sale_deliveries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sale_deliveries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    recipient_name character varying,
    recipient_phone character varying,
    recipient_email character varying,
    delivery_address character varying,
    delivery_fee numeric(10,2),
    dispatch_date timestamp with time zone,
    delivery_date timestamp with time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    otp character varying,
    otp_expires_at timestamp with time zone,
    otp_verified boolean DEFAULT false,
    "saleId" character varying
);


ALTER TABLE public.sale_deliveries OWNER TO neondb_owner;

--
-- TOC entry 232 (class 1259 OID 16628)
-- Name: sale_invoices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sale_invoices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "saleId" character varying,
    "issuedById" character varying
);


ALTER TABLE public.sale_invoices OWNER TO neondb_owner;

--
-- TOC entry 228 (class 1259 OID 16587)
-- Name: sale_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sale_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    "saleId" character varying,
    "productId" character varying
);


ALTER TABLE public.sale_items OWNER TO neondb_owner;

--
-- TOC entry 233 (class 1259 OID 16636)
-- Name: sales; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sales (
    id character varying NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    discount_amount numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    payable_amount numeric(10,2) NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    sale_source character varying DEFAULT 'store'::character varying NOT NULL,
    customer_name character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    "storeId" character varying,
    "cashierId" character varying
);


ALTER TABLE public.sales OWNER TO neondb_owner;

--
-- TOC entry 226 (class 1259 OID 16565)
-- Name: store_stocks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.store_stocks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "storeId" character varying,
    "productId" character varying
);


ALTER TABLE public.store_stocks OWNER TO neondb_owner;

--
-- TOC entry 227 (class 1259 OID 16576)
-- Name: stores; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.stores (
    id character varying NOT NULL,
    name character varying NOT NULL,
    location character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.stores OWNER TO neondb_owner;

--
-- TOC entry 234 (class 1259 OID 16647)
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    name character varying(100) NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role character varying DEFAULT 'staff'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "storeId" character varying
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- TOC entry 3295 (class 2604 OID 16515)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 3578 (class 0 OID 16487)
-- Dependencies: 219
-- Data for Name: users_sync; Type: TABLE DATA; Schema: neon_auth; Owner: neondb_owner
--

INSERT INTO neon_auth.users_sync VALUES ('{"id": "871b7e40-8a8b-4a8d-b620-ffcfb855c802", "display_name": "GIDEON SIMIYU", "has_password": false, "is_anonymous": false, "primary_email": "gwandabi23@gmail.com", "selected_team": null, "auth_with_email": false, "client_metadata": null, "oauth_providers": [], "server_metadata": null, "otp_auth_enabled": false, "selected_team_id": null, "profile_image_url": null, "requires_totp_mfa": false, "signed_up_at_millis": 1763813362036, "passkey_auth_enabled": false, "last_active_at_millis": 1763813362036, "primary_email_verified": false, "client_read_only_metadata": null, "primary_email_auth_enabled": true}', DEFAULT, DEFAULT, DEFAULT, DEFAULT, '2025-11-22 12:09:22+00', NULL);


--
-- TOC entry 3581 (class 0 OID 16520)
-- Dependencies: 222
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.categories VALUES ('248ec9c4-c684-4678-9b55-c52400415e87', 'BANNERS', 'BANNERS', '2025-11-22 12:23:55.750862', '2025-11-22 12:23:55.750862');
INSERT INTO public.categories VALUES ('404537dc-ff7e-43c6-aac7-20ea0a6db751', 'VINYL', 'VINYL', '2025-11-22 12:24:15.222645', '2025-11-22 12:24:15.222645');
INSERT INTO public.categories VALUES ('c1138d3c-24ae-428a-86ce-51307ed5eaa6', 'BOARDS', 'BOARDS', '2025-11-22 12:24:28.875412', '2025-11-22 12:24:28.875412');


--
-- TOC entry 3601 (class 0 OID 16716)
-- Dependencies: 242
-- Data for Name: conversion_recipes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- TOC entry 3583 (class 0 OID 16543)
-- Dependencies: 224
-- Data for Name: conversions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.conversions VALUES ('19b62163-8f4e-4e22-a060-cd2e81e97423', 50.00, 'meter', 'roll', '2025-11-22 12:44:41.884615', '2025-11-22 12:44:41.884615', 'PRD251100001');
INSERT INTO public.conversions VALUES ('996572ae-d5a2-434a-8fd4-3632197be298', 50.00, 'meter', 'roll', '2025-11-22 12:45:46.937514', '2025-11-22 12:45:46.937514', 'PRD251100002');
INSERT INTO public.conversions VALUES ('9c0f7734-b949-46e4-ab07-d5ea1b0bfed1', 50.00, 'meter', 'null', '2025-11-22 12:48:02.905884', '2025-11-22 12:48:02.905884', 'PRD251100003');
INSERT INTO public.conversions VALUES ('16a6f983-ff83-4334-a954-38f55cc80358', 20.00, 'meter', 'roll', '2025-11-22 12:48:02.915231', '2025-11-22 12:48:02.915231', 'PRD251100005');
INSERT INTO public.conversions VALUES ('8f7b0231-cf13-493e-80e0-62de9f78d39c', 20.00, 'meter', 'null', '2025-11-22 12:48:02.916404', '2025-11-22 12:48:02.916404', 'PRD251100004');


--
-- TOC entry 3589 (class 0 OID 16606)
-- Dependencies: 230
-- Data for Name: delivered_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- TOC entry 3582 (class 0 OID 16532)
-- Dependencies: 223
-- Data for Name: discounts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.discounts VALUES ('c245d004-e48b-4f02-9ef8-7487c2f6e2b6', 10.00, NULL, true, '2025-11-22 17:01:38.091419', '2025-11-22 17:01:38.091419', 'PRD251100003');


--
-- TOC entry 3594 (class 0 OID 16660)
-- Dependencies: 235
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.inventory VALUES ('INV251100001', 40, NULL, '2025-11-22 12:46:50.36102', 'STR251100001', 'PRD251100001', NULL);


--
-- TOC entry 3602 (class 0 OID 16728)
-- Dependencies: 243
-- Data for Name: inventory_conversions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- TOC entry 3580 (class 0 OID 16512)
-- Dependencies: 221
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.migrations VALUES (1, 1763813984226, 'InitMigration1763813984226');


--
-- TOC entry 3588 (class 0 OID 16595)
-- Dependencies: 229
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- TOC entry 3584 (class 0 OID 16553)
-- Dependencies: 225
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.products VALUES ('PRD251100001', 'PRD251100001', 'FRONTLIT BANNER 1.5 M 440GSM', '/uploads/products/product-1763814498526-386908478.jpg', 300.00, 18, 'meter', '2025-11-22 12:28:24.509432', '2025-11-22 12:28:24.509432', '248ec9c4-c684-4678-9b55-c52400415e87');
INSERT INTO public.products VALUES ('PRD251100002', 'PRD251100002', 'FRONTLIT BANNER 2.7 M 440GSM', '/uploads/products/product-1763814540278-404710757.jpg', 350.00, 18, 'meter', '2025-11-22 12:29:03.40984', '2025-11-22 12:29:03.40984', '248ec9c4-c684-4678-9b55-c52400415e87');
INSERT INTO public.products VALUES ('PRD251100003', 'PRD251100003', 'FRONTLIT BANNER1.2 M 440GSM', '/uploads/products/product-1763814559330-473305403.jpg', 250.00, 18, 'meter', '2025-11-22 12:29:22.25194', '2025-11-22 12:29:22.25194', '248ec9c4-c684-4678-9b55-c52400415e87');
INSERT INTO public.products VALUES ('PRD251100004', 'PRD251100004', '1.27  PRINTABLE MATTE', '/uploads/products/product-1763815357584-269365830.jpg', 250.00, 18, 'meter', '2025-11-22 12:42:40.769026', '2025-11-22 12:42:40.769026', '404537dc-ff7e-43c6-aac7-20ea0a6db751');
INSERT INTO public.products VALUES ('PRD251100005', 'PRD251100005', 'VINYL PURPLE  2 FEET / ROLL', '/uploads/products/product-1763815386819-572921715.jpg', 290.00, 18, 'meter', '2025-11-22 12:43:09.931914', '2025-11-22 12:43:09.931914', '404537dc-ff7e-43c6-aac7-20ea0a6db751');


--
-- TOC entry 3595 (class 0 OID 16668)
-- Dependencies: 236
-- Data for Name: reserved_inventory_ids; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.reserved_inventory_ids VALUES ('INV251100002', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100003', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100004', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100005', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100006', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100007', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100008', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100009', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100010', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100011', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100012', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100013', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100014', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100015', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100016', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100017', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100018', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100019', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100020', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100021', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100022', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100023', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100024', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100025', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100026', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100027', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100028', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100029', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100030', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100031', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100032', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100033', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100034', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100035', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100036', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100037', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100038', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100039', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100040', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100041', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100042', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100043', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100044', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100045', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100046', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100047', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100048', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100049', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100050', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100051', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100052', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100053', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100054', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100055', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100056', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100057', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100058', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100059', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100060', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100061', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100062', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100063', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100064', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100065', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100066', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100067', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100068', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100069', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100070', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100071', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100072', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100073', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100074', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100075', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100076', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100077', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100078', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100079', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100080', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100081', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100082', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100083', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100084', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100085', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100086', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100087', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100088', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100089', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100090', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100091', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100092', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100093', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100094', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100095', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100096', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100097', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100098', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100099', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100100', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100101', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100102', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100103', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100104', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100105', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100106', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100107', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100108', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100109', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100110', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100111', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100112', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100113', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100114', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100115', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100116', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100117', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100118', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100119', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100120', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100121', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100122', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100123', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100124', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100125', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100126', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100127', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100128', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100129', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100130', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100131', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100132', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100133', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100134', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100135', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100136', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100137', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100138', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100139', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100140', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100141', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100142', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100143', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100144', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100145', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100146', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100147', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100148', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100149', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100150', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100151', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100152', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100153', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100154', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100155', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100156', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100157', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100158', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100159', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100160', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100161', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100162', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100163', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100164', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100165', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100166', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100167', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100168', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100169', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100170', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100171', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100172', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100173', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100174', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100175', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100176', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100177', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100178', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100179', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100180', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100181', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100182', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100183', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100184', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100185', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100186', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100187', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100188', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100189', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100190', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100191', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100192', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100193', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100194', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100195', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100196', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100197', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100198', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100199', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100200', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100201', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100202', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100203', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100204', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100205', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100206', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100207', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100208', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100209', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100210', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100211', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100212', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100213', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100214', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100215', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100216', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100217', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100218', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100219', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100220', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100221', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100222', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100223', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100224', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100225', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100226', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100227', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100228', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100229', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100230', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100231', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100232', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100233', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100234', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100235', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100236', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100237', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100238', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100239', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100240', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100241', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100242', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100243', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100244', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100245', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100246', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100247', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100248', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100249', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100250', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100251', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100252', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100253', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100254', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100255', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100256', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100257', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100258', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100259', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100260', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100261', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100262', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100263', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100264', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100265', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100266', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100267', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100268', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100269', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100270', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100271', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100272', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100273', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100274', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100275', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100276', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100277', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100278', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100279', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100280', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100281', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100282', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100283', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100284', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100285', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100286', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100287', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100288', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100289', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100290', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100291', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100292', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100293', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100294', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100295', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100296', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100297', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100298', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100299', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100300', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100301', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100302', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100303', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100304', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100305', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100306', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100307', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100308', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100309', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100310', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100311', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100312', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100313', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100314', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100315', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100316', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100317', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100318', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100319', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100320', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100321', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100322', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100323', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100324', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100325', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100326', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100327', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100328', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100329', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100330', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100331', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100332', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100333', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100334', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100335', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100336', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100337', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100338', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100339', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100340', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100341', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100342', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100343', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100344', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100345', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100346', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100347', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100348', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100349', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100350', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100351', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100352', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100353', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100354', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100355', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100356', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100357', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100358', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100359', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100360', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100361', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100362', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100363', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100364', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100365', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100366', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100367', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100368', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100369', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100370', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100371', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100372', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100373', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100374', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100375', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100376', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100377', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100378', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100379', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100380', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100381', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100382', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100383', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100384', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100385', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100386', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100387', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100388', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100389', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100390', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100391', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100392', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100393', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100394', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100395', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100396', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100397', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100398', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100399', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100400', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100401', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100402', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100403', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100404', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100405', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100406', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100407', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100408', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100409', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100410', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100411', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100412', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100413', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100414', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100415', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100416', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100417', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100418', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100419', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100420', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100421', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100422', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100423', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100424', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100425', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100426', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100427', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100428', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100429', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100430', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100431', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100432', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100433', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100434', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100435', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100436', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100437', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100438', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100439', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100440', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100441', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100442', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100443', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100444', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100445', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100446', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100447', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100448', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100449', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100450', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100451', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100452', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100453', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100454', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100455', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100456', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100457', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100458', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100459', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100460', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100461', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100462', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100463', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100464', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100465', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100466', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100467', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100468', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100469', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100470', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100471', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100472', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100473', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100474', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100475', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100476', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100477', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100478', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100479', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100480', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100481', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100482', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100483', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100484', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100485', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100486', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100487', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100488', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100489', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100490', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100491', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100492', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100493', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100494', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100495', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100496', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100497', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100498', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100499', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100500', false);
INSERT INTO public.reserved_inventory_ids VALUES ('INV251100001', true);


--
-- TOC entry 3596 (class 0 OID 16676)
-- Dependencies: 237
-- Data for Name: reserved_payment_ids; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- TOC entry 3598 (class 0 OID 16692)
-- Dependencies: 239
-- Data for Name: reserved_product_ids; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.reserved_product_ids VALUES ('PRD251100006', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100007', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100008', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100009', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100010', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100011', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100012', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100013', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100014', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100015', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100016', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100017', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100018', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100019', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100020', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100021', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100022', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100023', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100024', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100025', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100026', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100027', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100028', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100029', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100030', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100031', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100032', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100033', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100034', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100035', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100036', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100037', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100038', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100039', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100040', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100041', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100042', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100043', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100044', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100045', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100046', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100047', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100048', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100049', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100050', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100051', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100052', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100053', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100054', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100055', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100056', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100057', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100058', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100059', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100060', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100061', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100062', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100063', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100064', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100065', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100066', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100067', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100068', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100069', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100070', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100071', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100072', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100073', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100074', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100075', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100076', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100077', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100078', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100079', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100080', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100081', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100082', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100083', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100084', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100085', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100086', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100087', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100088', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100089', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100090', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100091', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100092', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100093', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100094', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100095', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100096', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100097', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100098', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100099', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100100', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100101', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100102', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100103', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100104', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100105', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100106', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100107', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100108', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100109', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100110', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100111', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100112', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100113', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100114', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100115', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100116', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100117', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100118', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100119', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100120', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100121', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100122', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100123', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100124', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100125', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100126', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100127', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100128', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100129', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100130', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100131', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100132', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100133', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100134', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100135', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100136', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100137', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100138', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100139', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100140', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100141', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100142', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100143', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100144', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100145', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100146', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100147', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100148', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100149', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100150', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100151', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100152', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100153', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100154', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100155', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100156', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100157', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100158', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100159', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100160', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100161', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100162', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100163', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100164', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100165', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100166', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100167', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100168', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100169', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100170', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100171', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100172', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100173', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100174', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100175', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100176', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100177', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100178', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100179', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100180', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100181', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100182', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100183', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100184', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100185', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100002', true);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100003', true);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100004', true);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100005', true);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100186', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100187', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100188', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100189', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100190', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100191', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100192', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100193', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100194', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100195', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100196', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100197', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100198', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100199', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100200', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100201', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100202', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100203', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100204', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100205', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100206', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100207', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100208', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100209', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100210', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100211', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100212', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100213', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100214', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100215', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100216', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100217', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100218', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100219', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100220', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100221', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100222', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100223', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100224', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100225', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100226', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100227', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100228', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100229', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100230', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100231', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100232', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100233', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100234', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100235', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100236', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100237', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100238', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100239', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100240', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100241', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100242', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100243', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100244', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100245', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100246', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100247', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100248', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100249', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100250', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100251', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100252', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100253', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100254', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100255', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100256', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100257', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100258', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100259', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100260', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100261', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100262', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100263', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100264', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100265', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100266', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100267', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100268', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100269', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100270', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100271', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100272', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100273', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100274', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100275', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100276', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100277', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100278', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100279', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100280', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100281', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100282', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100283', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100284', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100285', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100286', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100287', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100288', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100289', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100290', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100291', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100292', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100293', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100294', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100295', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100296', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100297', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100298', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100299', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100300', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100301', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100302', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100303', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100304', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100305', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100306', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100307', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100308', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100309', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100310', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100311', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100312', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100313', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100314', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100315', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100316', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100317', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100318', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100319', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100320', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100321', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100322', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100323', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100324', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100325', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100326', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100327', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100328', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100329', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100330', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100331', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100332', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100333', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100334', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100335', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100336', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100337', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100338', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100339', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100340', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100341', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100342', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100343', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100344', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100345', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100346', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100347', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100348', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100349', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100350', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100351', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100352', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100353', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100354', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100355', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100356', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100357', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100358', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100359', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100360', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100361', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100362', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100363', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100364', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100365', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100366', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100367', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100368', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100369', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100370', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100371', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100372', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100373', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100374', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100375', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100376', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100377', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100378', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100379', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100380', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100381', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100382', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100383', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100384', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100385', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100386', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100387', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100388', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100389', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100390', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100391', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100392', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100393', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100394', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100395', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100396', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100397', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100398', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100399', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100400', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100401', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100402', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100403', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100404', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100405', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100406', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100407', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100408', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100409', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100410', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100411', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100412', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100413', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100414', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100415', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100416', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100417', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100418', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100419', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100420', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100421', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100422', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100423', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100424', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100425', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100426', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100427', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100428', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100429', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100430', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100431', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100432', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100433', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100434', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100435', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100436', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100437', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100438', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100439', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100440', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100441', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100442', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100443', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100444', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100445', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100446', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100447', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100448', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100449', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100450', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100451', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100452', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100453', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100454', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100455', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100456', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100457', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100458', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100459', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100460', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100461', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100462', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100463', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100464', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100465', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100466', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100467', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100468', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100469', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100470', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100471', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100472', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100473', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100474', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100475', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100476', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100477', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100478', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100479', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100480', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100481', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100482', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100483', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100484', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100485', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100486', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100487', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100488', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100489', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100490', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100491', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100492', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100493', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100494', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100495', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100496', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100497', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100498', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100499', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100500', false);
INSERT INTO public.reserved_product_ids VALUES ('PRD251100001', true);


--
-- TOC entry 3597 (class 0 OID 16684)
-- Dependencies: 238
-- Data for Name: reserved_sale_ids; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.reserved_sale_ids VALUES ('SAL251100002', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100003', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100004', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100005', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100006', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100007', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100008', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100009', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100010', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100011', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100012', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100013', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100014', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100015', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100016', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100017', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100018', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100019', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100020', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100021', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100022', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100023', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100024', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100025', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100026', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100027', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100028', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100029', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100030', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100031', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100032', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100033', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100034', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100035', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100036', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100037', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100038', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100039', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100040', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100041', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100042', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100043', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100044', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100045', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100046', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100047', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100048', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100049', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100050', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100051', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100052', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100053', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100054', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100055', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100056', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100057', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100058', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100059', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100060', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100061', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100062', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100063', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100064', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100065', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100066', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100067', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100068', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100069', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100070', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100071', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100072', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100073', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100074', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100075', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100076', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100077', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100078', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100079', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100080', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100081', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100082', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100083', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100084', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100085', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100086', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100087', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100088', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100089', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100090', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100091', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100092', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100093', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100094', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100095', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100096', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100097', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100098', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100099', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100100', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100101', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100102', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100103', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100104', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100105', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100106', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100107', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100108', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100109', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100110', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100111', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100112', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100113', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100114', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100115', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100116', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100117', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100118', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100119', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100120', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100121', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100122', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100123', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100124', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100125', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100126', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100127', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100128', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100129', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100130', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100131', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100132', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100133', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100134', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100135', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100136', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100137', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100138', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100139', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100140', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100141', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100142', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100143', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100144', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100145', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100146', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100147', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100148', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100149', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100150', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100151', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100152', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100153', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100154', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100155', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100156', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100157', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100158', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100159', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100160', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100161', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100162', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100163', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100164', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100165', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100166', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100167', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100168', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100169', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100170', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100171', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100172', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100173', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100174', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100175', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100176', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100177', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100178', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100179', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100180', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100181', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100182', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100183', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100184', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100185', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100186', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100187', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100188', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100189', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100190', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100191', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100192', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100193', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100194', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100195', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100196', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100197', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100198', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100199', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100200', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100201', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100202', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100203', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100204', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100205', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100206', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100207', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100208', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100209', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100210', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100211', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100212', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100213', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100214', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100215', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100216', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100217', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100218', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100219', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100220', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100221', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100222', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100223', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100224', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100225', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100226', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100227', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100228', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100229', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100230', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100231', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100232', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100233', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100234', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100235', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100236', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100237', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100238', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100239', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100240', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100241', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100242', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100243', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100244', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100245', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100246', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100247', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100248', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100249', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100250', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100251', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100252', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100253', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100254', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100255', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100256', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100257', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100258', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100259', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100260', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100261', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100262', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100263', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100264', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100265', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100266', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100267', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100268', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100269', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100270', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100271', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100272', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100273', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100274', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100275', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100276', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100277', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100278', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100279', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100280', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100281', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100282', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100283', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100284', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100285', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100286', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100287', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100288', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100289', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100290', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100291', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100292', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100293', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100294', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100295', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100296', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100297', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100298', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100299', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100300', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100301', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100302', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100303', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100304', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100305', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100306', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100307', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100308', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100309', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100310', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100311', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100312', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100313', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100314', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100315', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100316', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100317', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100318', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100319', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100320', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100321', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100322', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100323', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100324', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100325', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100326', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100327', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100328', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100329', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100330', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100331', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100332', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100333', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100334', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100335', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100336', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100337', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100338', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100339', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100340', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100341', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100342', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100343', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100344', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100345', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100346', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100347', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100348', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100349', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100350', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100351', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100352', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100353', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100354', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100355', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100356', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100357', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100358', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100359', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100360', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100361', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100362', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100363', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100364', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100365', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100366', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100367', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100368', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100369', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100370', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100371', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100372', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100373', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100374', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100375', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100376', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100377', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100378', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100379', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100380', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100381', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100382', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100383', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100384', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100385', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100386', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100387', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100388', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100389', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100390', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100391', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100392', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100393', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100394', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100395', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100396', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100397', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100398', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100399', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100400', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100401', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100402', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100403', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100404', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100405', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100406', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100407', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100408', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100409', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100410', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100411', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100412', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100413', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100414', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100415', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100416', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100417', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100418', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100419', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100420', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100421', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100422', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100423', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100424', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100425', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100426', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100427', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100428', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100429', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100430', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100431', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100432', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100433', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100434', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100435', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100436', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100437', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100438', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100439', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100440', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100441', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100442', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100443', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100444', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100445', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100446', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100447', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100448', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100449', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100450', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100451', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100452', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100453', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100454', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100455', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100456', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100457', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100458', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100459', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100460', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100461', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100462', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100463', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100464', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100465', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100466', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100467', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100468', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100469', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100470', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100471', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100472', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100473', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100474', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100475', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100476', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100477', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100478', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100479', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100480', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100481', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100482', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100483', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100484', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100485', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100486', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100487', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100488', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100489', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100490', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100491', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100492', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100493', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100494', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100495', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100496', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100497', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100498', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100499', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100500', false);
INSERT INTO public.reserved_sale_ids VALUES ('SAL251100001', true);


--
-- TOC entry 3600 (class 0 OID 16708)
-- Dependencies: 241
-- Data for Name: reserved_store_ids; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.reserved_store_ids VALUES ('STR251100003', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100004', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100005', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100006', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100007', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100008', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100009', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100010', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100011', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100012', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100013', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100014', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100015', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100016', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100017', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100018', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100019', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100020', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100021', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100022', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100023', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100024', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100025', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100026', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100027', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100028', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100029', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100030', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100031', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100032', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100033', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100034', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100035', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100036', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100037', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100038', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100039', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100040', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100041', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100042', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100043', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100044', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100045', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100046', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100047', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100048', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100049', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100050', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100051', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100052', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100053', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100054', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100055', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100056', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100057', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100058', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100059', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100060', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100061', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100062', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100063', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100064', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100065', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100066', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100067', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100068', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100069', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100070', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100071', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100072', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100073', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100074', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100075', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100076', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100077', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100078', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100079', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100080', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100081', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100082', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100083', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100084', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100085', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100086', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100087', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100088', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100089', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100090', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100091', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100092', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100093', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100094', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100095', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100096', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100097', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100098', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100099', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100100', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100101', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100102', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100103', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100104', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100105', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100106', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100107', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100108', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100109', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100110', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100111', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100112', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100113', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100114', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100115', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100116', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100117', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100118', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100119', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100120', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100121', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100122', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100123', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100124', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100125', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100126', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100127', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100128', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100129', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100130', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100131', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100132', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100133', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100134', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100135', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100136', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100137', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100138', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100139', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100140', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100141', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100142', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100143', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100144', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100145', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100146', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100147', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100148', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100149', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100150', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100151', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100152', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100153', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100154', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100155', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100156', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100157', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100158', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100159', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100160', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100161', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100162', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100163', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100164', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100165', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100166', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100167', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100168', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100169', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100170', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100171', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100172', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100173', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100174', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100175', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100176', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100177', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100178', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100179', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100180', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100181', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100182', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100183', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100184', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100185', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100002', true);
INSERT INTO public.reserved_store_ids VALUES ('STR251100186', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100187', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100188', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100189', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100190', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100191', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100192', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100193', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100194', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100195', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100196', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100197', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100198', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100199', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100200', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100201', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100202', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100203', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100204', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100205', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100206', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100207', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100208', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100209', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100210', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100211', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100212', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100213', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100214', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100215', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100216', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100217', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100218', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100219', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100220', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100221', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100222', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100223', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100224', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100225', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100226', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100227', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100228', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100229', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100230', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100231', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100232', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100233', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100234', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100235', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100236', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100237', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100238', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100239', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100240', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100241', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100242', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100243', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100244', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100245', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100246', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100247', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100248', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100249', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100250', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100251', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100252', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100253', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100254', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100255', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100256', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100257', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100258', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100259', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100260', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100261', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100262', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100263', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100264', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100265', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100266', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100267', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100268', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100269', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100270', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100271', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100272', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100273', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100274', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100275', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100276', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100277', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100278', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100279', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100280', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100281', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100282', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100283', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100284', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100285', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100286', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100287', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100288', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100289', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100290', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100291', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100292', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100293', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100294', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100295', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100296', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100297', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100298', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100299', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100300', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100301', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100302', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100303', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100304', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100305', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100306', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100307', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100308', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100309', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100310', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100311', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100312', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100313', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100314', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100315', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100316', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100317', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100318', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100319', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100320', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100321', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100322', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100323', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100324', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100325', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100326', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100327', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100328', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100329', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100330', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100331', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100332', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100333', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100334', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100335', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100336', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100337', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100338', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100339', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100340', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100341', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100342', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100343', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100344', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100345', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100346', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100347', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100348', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100349', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100350', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100351', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100352', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100353', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100354', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100355', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100356', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100357', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100358', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100359', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100360', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100361', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100362', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100363', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100364', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100365', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100366', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100367', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100368', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100369', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100370', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100371', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100372', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100373', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100374', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100375', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100376', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100377', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100378', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100379', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100380', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100381', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100382', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100383', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100384', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100385', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100386', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100387', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100388', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100389', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100390', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100391', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100392', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100393', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100394', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100395', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100396', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100397', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100398', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100399', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100400', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100401', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100402', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100403', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100404', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100405', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100406', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100407', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100408', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100409', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100410', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100411', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100412', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100413', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100414', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100415', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100416', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100417', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100418', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100419', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100420', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100421', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100422', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100423', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100424', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100425', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100426', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100427', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100428', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100429', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100430', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100431', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100432', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100433', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100434', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100435', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100436', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100437', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100438', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100439', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100440', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100441', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100442', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100443', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100444', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100445', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100446', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100447', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100448', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100449', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100450', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100451', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100452', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100453', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100454', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100455', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100456', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100457', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100458', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100459', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100460', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100461', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100462', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100463', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100464', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100465', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100466', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100467', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100468', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100469', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100470', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100471', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100472', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100473', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100474', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100475', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100476', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100477', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100478', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100479', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100480', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100481', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100482', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100483', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100484', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100485', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100486', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100487', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100488', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100489', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100490', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100491', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100492', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100493', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100494', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100495', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100496', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100497', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100498', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100499', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100500', false);
INSERT INTO public.reserved_store_ids VALUES ('STR251100001', true);


--
-- TOC entry 3599 (class 0 OID 16700)
-- Dependencies: 240
-- Data for Name: reserved_user_ids; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.reserved_user_ids VALUES ('USR251100002', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100003', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100004', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100005', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100006', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100007', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100008', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100009', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100010', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100011', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100012', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100013', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100014', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100015', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100016', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100017', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100018', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100019', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100020', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100021', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100022', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100023', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100024', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100025', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100026', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100027', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100028', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100029', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100030', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100031', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100032', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100033', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100034', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100035', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100036', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100037', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100038', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100039', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100040', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100041', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100042', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100043', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100044', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100045', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100046', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100047', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100048', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100049', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100050', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100051', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100052', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100053', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100054', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100055', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100056', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100057', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100058', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100059', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100060', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100061', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100062', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100063', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100064', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100065', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100066', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100067', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100068', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100069', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100070', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100071', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100072', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100073', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100074', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100075', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100076', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100077', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100078', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100079', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100080', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100081', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100082', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100083', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100084', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100085', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100086', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100087', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100088', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100089', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100090', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100091', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100092', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100093', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100094', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100095', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100096', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100097', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100098', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100099', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100100', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100101', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100102', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100103', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100104', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100105', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100106', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100107', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100108', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100109', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100110', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100111', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100112', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100113', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100114', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100115', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100116', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100117', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100118', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100119', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100120', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100121', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100122', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100123', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100124', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100125', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100126', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100127', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100128', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100129', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100130', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100131', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100132', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100133', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100134', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100135', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100136', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100137', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100138', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100139', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100140', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100141', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100142', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100143', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100144', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100145', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100146', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100147', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100148', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100149', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100150', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100151', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100152', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100153', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100154', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100155', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100156', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100157', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100158', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100159', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100160', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100161', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100162', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100163', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100164', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100165', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100166', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100167', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100168', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100169', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100170', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100171', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100172', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100173', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100174', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100175', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100176', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100177', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100178', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100179', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100180', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100181', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100182', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100183', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100184', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100185', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100186', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100187', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100188', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100189', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100190', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100191', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100192', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100193', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100194', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100195', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100196', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100197', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100198', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100199', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100200', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100201', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100202', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100203', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100204', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100205', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100206', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100207', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100208', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100209', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100210', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100211', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100212', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100213', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100214', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100215', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100216', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100217', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100218', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100219', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100220', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100221', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100222', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100223', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100224', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100225', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100226', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100227', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100228', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100229', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100230', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100231', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100232', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100233', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100234', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100235', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100236', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100237', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100238', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100239', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100240', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100241', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100242', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100243', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100244', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100245', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100246', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100247', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100248', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100249', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100250', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100251', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100252', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100253', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100254', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100255', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100256', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100257', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100258', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100259', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100260', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100261', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100262', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100263', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100264', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100265', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100266', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100267', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100268', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100269', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100270', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100271', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100272', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100273', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100274', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100275', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100276', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100277', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100278', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100279', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100280', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100281', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100282', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100283', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100284', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100285', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100286', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100287', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100288', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100289', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100290', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100291', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100292', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100293', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100294', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100295', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100296', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100297', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100298', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100299', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100300', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100301', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100302', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100303', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100304', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100305', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100306', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100307', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100308', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100309', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100310', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100311', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100312', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100313', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100314', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100315', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100316', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100317', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100318', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100319', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100320', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100321', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100322', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100323', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100324', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100325', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100326', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100327', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100328', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100329', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100330', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100331', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100332', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100333', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100334', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100335', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100336', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100337', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100338', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100339', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100340', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100341', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100342', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100343', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100344', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100345', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100346', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100347', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100348', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100349', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100350', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100351', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100352', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100353', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100354', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100355', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100356', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100357', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100358', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100359', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100360', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100361', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100362', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100363', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100364', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100365', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100366', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100367', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100368', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100369', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100370', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100371', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100372', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100373', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100374', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100375', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100376', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100377', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100378', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100379', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100380', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100381', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100382', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100383', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100384', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100385', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100386', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100387', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100388', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100389', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100390', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100391', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100392', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100393', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100394', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100395', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100396', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100397', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100398', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100399', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100400', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100401', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100402', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100403', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100404', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100405', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100406', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100407', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100408', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100409', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100410', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100411', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100412', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100413', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100414', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100415', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100416', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100417', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100418', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100419', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100420', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100421', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100422', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100423', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100424', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100425', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100426', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100427', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100428', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100429', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100430', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100431', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100432', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100433', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100434', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100435', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100436', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100437', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100438', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100439', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100440', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100441', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100442', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100443', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100444', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100445', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100446', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100447', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100448', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100449', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100450', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100451', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100452', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100453', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100454', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100455', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100456', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100457', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100458', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100459', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100460', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100461', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100462', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100463', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100464', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100465', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100466', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100467', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100468', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100469', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100470', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100471', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100472', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100473', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100474', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100475', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100476', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100477', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100478', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100479', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100480', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100481', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100482', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100483', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100484', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100485', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100486', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100487', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100488', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100489', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100490', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100491', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100492', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100493', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100494', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100495', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100496', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100497', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100498', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100499', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100500', false);
INSERT INTO public.reserved_user_ids VALUES ('USR251100001', true);


--
-- TOC entry 3590 (class 0 OID 16614)
-- Dependencies: 231
-- Data for Name: sale_deliveries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.sale_deliveries VALUES ('95496eb9-08ca-4bc2-a751-fc205ec80645', 'pending', 'GIDEON SIMIYU', '0712881672', 'GWANDABI23@GMAIL.COM', 'Kiambu', NULL, NULL, NULL, '2025-11-22 17:14:41.431841', '2025-11-22 17:14:41.431841', NULL, NULL, false, 'SAL251100001');


--
-- TOC entry 3591 (class 0 OID 16628)
-- Dependencies: 232
-- Data for Name: sale_invoices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- TOC entry 3587 (class 0 OID 16587)
-- Dependencies: 228
-- Data for Name: sale_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.sale_items VALUES ('d18451b8-c213-4b52-a05b-2be97937d658', 25, 225.00, 5625.00, 'SAL251100001', 'PRD251100003');
INSERT INTO public.sale_items VALUES ('c387ff5a-912d-4701-a0ea-3f6f7749bd5e', 100, 300.00, 30000.00, 'SAL251100001', 'PRD251100001');


--
-- TOC entry 3592 (class 0 OID 16636)
-- Dependencies: 233
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.sales VALUES ('SAL251100001', 36250.00, 625.00, 35625.00, 'pending', 'store', 'GIDEON SIMIYU', '2025-11-22 17:14:41.431841', 'STR251100001', NULL);


--
-- TOC entry 3585 (class 0 OID 16565)
-- Dependencies: 226
-- Data for Name: store_stocks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.store_stocks VALUES ('835ea097-94e0-45ba-9982-72bfce898c5e', 600, '2025-11-22 12:49:20.688934', '2025-11-22 12:49:20.688934', 'STR251100001', 'PRD251100002');
INSERT INTO public.store_stocks VALUES ('fa109720-0eb2-4a8b-b838-c8ff092cbd68', 400, '2025-11-22 12:49:20.696201', '2025-11-22 12:49:20.696201', 'STR251100001', 'PRD251100004');
INSERT INTO public.store_stocks VALUES ('ef159656-2c29-459d-95a9-9e5cc03f3a76', 200, '2025-11-22 12:49:20.697111', '2025-11-22 12:49:20.697111', 'STR251100001', 'PRD251100005');
INSERT INTO public.store_stocks VALUES ('3d3f18c1-3079-47e1-8203-98f945135ae9', 250, '2025-11-22 12:50:38.544005', '2025-11-22 12:50:38.544005', 'STR251100002', 'PRD251100003');
INSERT INTO public.store_stocks VALUES ('2cf9a1ed-aa4b-411d-af74-944d1ab9a635', 200, '2025-11-22 12:50:38.544442', '2025-11-22 12:50:38.544442', 'STR251100002', 'PRD251100005');
INSERT INTO public.store_stocks VALUES ('660e1abe-1a31-48c3-9e5f-893d907a4dcd', 300, '2025-11-22 12:50:38.544677', '2025-11-22 12:50:38.544677', 'STR251100002', 'PRD251100002');
INSERT INTO public.store_stocks VALUES ('af1ca8aa-c797-47e3-86ea-d74bec009c41', 100, '2025-11-22 12:50:38.545784', '2025-11-22 12:50:38.545784', 'STR251100002', 'PRD251100004');
INSERT INTO public.store_stocks VALUES ('fe35435b-7f36-480f-a637-aad459f62168', 150, '2025-11-22 12:50:38.544901', '2025-11-22 12:50:38.544901', 'STR251100002', 'PRD251100001');
INSERT INTO public.store_stocks VALUES ('fd32a8f8-ffbf-4d71-b9a2-438165839c1a', 325, '2025-11-22 12:49:20.690182', '2025-11-22 17:14:41.431841', 'STR251100001', 'PRD251100003');
INSERT INTO public.store_stocks VALUES ('adf0fa03-dcc7-47c4-b580-181378bab686', 300, '2025-11-22 12:46:50.36102', '2025-11-22 17:14:41.431841', 'STR251100001', 'PRD251100001');


--
-- TOC entry 3586 (class 0 OID 16576)
-- Dependencies: 227
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.stores VALUES ('STR251100001', 'My Store', 'Nairobi', '2025-11-22 12:41:08.341218', '2025-11-22 12:41:08.341218');
INSERT INTO public.stores VALUES ('STR251100002', 'New Store', 'Nairobi', '2025-11-22 12:43:40.045643', '2025-11-22 12:43:40.045643');


--
-- TOC entry 3593 (class 0 OID 16647)
-- Dependencies: 234
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.users VALUES ('USR251100001', 'GIDEON SIMIYU', 'gwandabi23@gmail.com', '$2b$10$0BEAngsb1/IxyChrLtiO5epuFBPPwbWLGruMXywcjd2XfjawC6bi2', 'admin', true, '2025-11-22 15:22:17.397', '2025-11-22 12:20:40.092068', '2025-11-22 12:22:17.955656', NULL);


--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 220
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, true);


--
-- TOC entry 3351 (class 2606 OID 16497)
-- Name: users_sync users_sync_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neondb_owner
--

ALTER TABLE ONLY neon_auth.users_sync
    ADD CONSTRAINT users_sync_pkey PRIMARY KEY (id);


--
-- TOC entry 3377 (class 2606 OID 16613)
-- Name: delivered_items PK_0449c7920e0c2d792e13d8cee76; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivered_items
    ADD CONSTRAINT "PK_0449c7920e0c2d792e13d8cee76" PRIMARY KEY (id);


--
-- TOC entry 3363 (class 2606 OID 16562)
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- TOC entry 3403 (class 2606 OID 16715)
-- Name: reserved_store_ids PK_18392f33b22ffb9eb7546608239; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reserved_store_ids
    ADD CONSTRAINT "PK_18392f33b22ffb9eb7546608239" PRIMARY KEY (store_id);


--
-- TOC entry 3375 (class 2606 OID 16605)
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- TOC entry 3407 (class 2606 OID 16736)
-- Name: inventory_conversions PK_24be9f35a8973f686f998f42438; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_conversions
    ADD CONSTRAINT "PK_24be9f35a8973f686f998f42438" PRIMARY KEY (id);


--
-- TOC entry 3355 (class 2606 OID 16529)
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- TOC entry 3367 (class 2606 OID 16575)
-- Name: store_stocks PK_37ce4d18867b0495dc178523d92; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.store_stocks
    ADD CONSTRAINT "PK_37ce4d18867b0495dc178523d92" PRIMARY KEY (id);


--
-- TOC entry 3399 (class 2606 OID 16699)
-- Name: reserved_product_ids PK_4a728a763abc084cfcb6e4790fd; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reserved_product_ids
    ADD CONSTRAINT "PK_4a728a763abc084cfcb6e4790fd" PRIMARY KEY (product_id);


--
-- TOC entry 3361 (class 2606 OID 16552)
-- Name: conversions PK_4af8c6388f42a1849ee9b22fa16; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversions
    ADD CONSTRAINT "PK_4af8c6388f42a1849ee9b22fa16" PRIMARY KEY (id);


--
-- TOC entry 3385 (class 2606 OID 16646)
-- Name: sales PK_4f0bc990ae81dba46da680895ea; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY (id);


--
-- TOC entry 3393 (class 2606 OID 16675)
-- Name: reserved_inventory_ids PK_5142f864caca58e0db4495187a9; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reserved_inventory_ids
    ADD CONSTRAINT "PK_5142f864caca58e0db4495187a9" PRIMARY KEY (inventory_id);


--
-- TOC entry 3373 (class 2606 OID 16594)
-- Name: sale_items PK_5a7dc5b4562a9e590528b3e08ab; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT "PK_5a7dc5b4562a9e590528b3e08ab" PRIMARY KEY (id);


--
-- TOC entry 3395 (class 2606 OID 16683)
-- Name: reserved_payment_ids PK_602a356d2df277f92057210d11c; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reserved_payment_ids
    ADD CONSTRAINT "PK_602a356d2df277f92057210d11c" PRIMARY KEY (payment_id);


--
-- TOC entry 3383 (class 2606 OID 16635)
-- Name: sale_invoices PK_60e00db29772a98d544fe50f7b1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sale_invoices
    ADD CONSTRAINT "PK_60e00db29772a98d544fe50f7b1" PRIMARY KEY (id);


--
-- TOC entry 3359 (class 2606 OID 16542)
-- Name: discounts PK_66c522004212dc814d6e2f14ecc; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY (id);


--
-- TOC entry 3397 (class 2606 OID 16691)
-- Name: reserved_sale_ids PK_6ac237fed57c59eee3313c34f42; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reserved_sale_ids
    ADD CONSTRAINT "PK_6ac237fed57c59eee3313c34f42" PRIMARY KEY (sale_id);


--
-- TOC entry 3369 (class 2606 OID 16584)
-- Name: stores PK_7aa6e7d71fa7acdd7ca43d7c9cb; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY (id);


--
-- TOC entry 3391 (class 2606 OID 16667)
-- Name: inventory PK_82aa5da437c5bbfb80703b08309; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY (id);


--
-- TOC entry 3353 (class 2606 OID 16519)
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- TOC entry 3387 (class 2606 OID 16657)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 3401 (class 2606 OID 16707)
-- Name: reserved_user_ids PK_cce31253146e698faa92f14dadc; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reserved_user_ids
    ADD CONSTRAINT "PK_cce31253146e698faa92f14dadc" PRIMARY KEY (user_id);


--
-- TOC entry 3405 (class 2606 OID 16727)
-- Name: conversion_recipes PK_d4ee84bee4005bc939f306399fe; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversion_recipes
    ADD CONSTRAINT "PK_d4ee84bee4005bc939f306399fe" PRIMARY KEY (id);


--
-- TOC entry 3379 (class 2606 OID 16625)
-- Name: sale_deliveries PK_e76aaee8aa27c741636c3e1ec17; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sale_deliveries
    ADD CONSTRAINT "PK_e76aaee8aa27c741636c3e1ec17" PRIMARY KEY (id);


--
-- TOC entry 3381 (class 2606 OID 16627)
-- Name: sale_deliveries REL_254508b66711a4a6442f62a56a; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sale_deliveries
    ADD CONSTRAINT "REL_254508b66711a4a6442f62a56a" UNIQUE ("saleId");


--
-- TOC entry 3357 (class 2606 OID 16531)
-- Name: categories UQ_8b0be371d28245da6e4f4b61878; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE (name);


--
-- TOC entry 3389 (class 2606 OID 16659)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 3371 (class 2606 OID 16586)
-- Name: stores UQ_a205ca5a37fa5e10005f003aaf3; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT "UQ_a205ca5a37fa5e10005f003aaf3" UNIQUE (name);


--
-- TOC entry 3365 (class 2606 OID 16564)
-- Name: products UQ_c44ac33a05b144dd0d9ddcf9327; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE (sku);


--
-- TOC entry 3349 (class 1259 OID 16498)
-- Name: users_sync_deleted_at_idx; Type: INDEX; Schema: neon_auth; Owner: neondb_owner
--

CREATE INDEX users_sync_deleted_at_idx ON neon_auth.users_sync USING btree (deleted_at);


--
-- TOC entry 3427 (class 2606 OID 16837)
-- Name: conversion_recipes FK_2018816f358956abdb748b40ed1; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversion_recipes
    ADD CONSTRAINT "FK_2018816f358956abdb748b40ed1" FOREIGN KEY ("toProductId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3429 (class 2606 OID 16852)
-- Name: inventory_conversions FK_2095371fc8070a79873251c551c; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_conversions
    ADD CONSTRAINT "FK_2095371fc8070a79873251c551c" FOREIGN KEY ("toProductId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3418 (class 2606 OID 16787)
-- Name: sale_deliveries FK_254508b66711a4a6442f62a56a4; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sale_deliveries
    ADD CONSTRAINT "FK_254508b66711a4a6442f62a56a4" FOREIGN KEY ("saleId") REFERENCES public.sales(id) ON DELETE CASCADE;


--
-- TOC entry 3424 (class 2606 OID 16827)
-- Name: inventory FK_271392f147259eeead4c9e1bcf1; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT "FK_271392f147259eeead4c9e1bcf1" FOREIGN KEY ("addedById") REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3430 (class 2606 OID 16857)
-- Name: inventory_conversions FK_28e5b42936e6f5bc61fa4c02174; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_conversions
    ADD CONSTRAINT "FK_28e5b42936e6f5bc61fa4c02174" FOREIGN KEY ("performedById") REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3409 (class 2606 OID 16742)
-- Name: conversions FK_31248c56bfdf3053fc52dd3538d; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversions
    ADD CONSTRAINT "FK_31248c56bfdf3053fc52dd3538d" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE SET NULL;


--
-- TOC entry 3421 (class 2606 OID 16807)
-- Name: sales FK_3b04a33c33ed9653a8a3cd316c5; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT "FK_3b04a33c33ed9653a8a3cd316c5" FOREIGN KEY ("cashierId") REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3411 (class 2606 OID 16757)
-- Name: store_stocks FK_4c98027a1e74efd57dc210c7c08; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.store_stocks
    ADD CONSTRAINT "FK_4c98027a1e74efd57dc210c7c08" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3431 (class 2606 OID 16842)
-- Name: inventory_conversions FK_4d6fc36c9e70bf4c6052f69947d; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_conversions
    ADD CONSTRAINT "FK_4d6fc36c9e70bf4c6052f69947d" FOREIGN KEY ("storeId") REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 3408 (class 2606 OID 16737)
-- Name: discounts FK_515a9b59c4344f0239956c218ac; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT "FK_515a9b59c4344f0239956c218ac" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE SET NULL;


--
-- TOC entry 3425 (class 2606 OID 16817)
-- Name: inventory FK_5ed96e04da0c7fec6205d485dca; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT "FK_5ed96e04da0c7fec6205d485dca" FOREIGN KEY ("storeId") REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 3412 (class 2606 OID 16752)
-- Name: store_stocks FK_6695452c8f75484bc2f7657c1d2; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.store_stocks
    ADD CONSTRAINT "FK_6695452c8f75484bc2f7657c1d2" FOREIGN KEY ("storeId") REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 3432 (class 2606 OID 16847)
-- Name: inventory_conversions FK_68db4869a7546482532f6fca933; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_conversions
    ADD CONSTRAINT "FK_68db4869a7546482532f6fca933" FOREIGN KEY ("fromProductId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3416 (class 2606 OID 16777)
-- Name: delivered_items FK_7c703fc61d49da103e5e2f730ea; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivered_items
    ADD CONSTRAINT "FK_7c703fc61d49da103e5e2f730ea" FOREIGN KEY ("deliveryId") REFERENCES public.sale_deliveries(id) ON DELETE CASCADE;


--
-- TOC entry 3428 (class 2606 OID 16832)
-- Name: conversion_recipes FK_88b3a17dda597f3cce9c3e1c501; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversion_recipes
    ADD CONSTRAINT "FK_88b3a17dda597f3cce9c3e1c501" FOREIGN KEY ("fromProductId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3419 (class 2606 OID 16797)
-- Name: sale_invoices FK_a182dfc1f1c124e760f96e9ffe6; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sale_invoices
    ADD CONSTRAINT "FK_a182dfc1f1c124e760f96e9ffe6" FOREIGN KEY ("issuedById") REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3420 (class 2606 OID 16792)
-- Name: sale_invoices FK_ad27814bdfdf9c1bb2247ff4543; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sale_invoices
    ADD CONSTRAINT "FK_ad27814bdfdf9c1bb2247ff4543" FOREIGN KEY ("saleId") REFERENCES public.sales(id) ON DELETE CASCADE;


--
-- TOC entry 3413 (class 2606 OID 16762)
-- Name: sale_items FK_c642be08de5235317d4cf3deb40; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT "FK_c642be08de5235317d4cf3deb40" FOREIGN KEY ("saleId") REFERENCES public.sales(id) ON DELETE CASCADE;


--
-- TOC entry 3423 (class 2606 OID 16812)
-- Name: users FK_c82cd4fa8f0ac4a74328abe997a; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_c82cd4fa8f0ac4a74328abe997a" FOREIGN KEY ("storeId") REFERENCES public.stores(id) ON DELETE SET NULL;


--
-- TOC entry 3426 (class 2606 OID 16822)
-- Name: inventory FK_c8622e1e24c6d054d36e8824490; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT "FK_c8622e1e24c6d054d36e8824490" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3414 (class 2606 OID 16767)
-- Name: sale_items FK_d675aea38a16313e844662c48f8; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT "FK_d675aea38a16313e844662c48f8" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE SET NULL;


--
-- TOC entry 3415 (class 2606 OID 16772)
-- Name: payments FK_e15427928c7a02bd304d628c41e; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_e15427928c7a02bd304d628c41e" FOREIGN KEY ("saleId") REFERENCES public.sales(id) ON DELETE CASCADE;


--
-- TOC entry 3422 (class 2606 OID 16802)
-- Name: sales FK_ef0e802924109a86947d4df5c9e; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT "FK_ef0e802924109a86947d4df5c9e" FOREIGN KEY ("storeId") REFERENCES public.stores(id) ON DELETE SET NULL;


--
-- TOC entry 3417 (class 2606 OID 16782)
-- Name: delivered_items FK_f71fb5ac2b7f9c047555e84a1f9; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivered_items
    ADD CONSTRAINT "FK_f71fb5ac2b7f9c047555e84a1f9" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE SET NULL;


--
-- TOC entry 3410 (class 2606 OID 16747)
-- Name: products FK_ff56834e735fa78a15d0cf21926; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 3608
-- Name: DATABASE neondb; Type: ACL; Schema: -; Owner: neondb_owner
--

GRANT ALL ON DATABASE neondb TO neon_superuser;


--
-- TOC entry 2149 (class 826 OID 16394)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- TOC entry 2148 (class 826 OID 16393)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


-- Completed on 2025-11-24 09:57:59

--
-- PostgreSQL database dump complete
--

\unrestrict KSG2jKOu41klSoz0F76oGPhG94fZ1WdXnYadWdQUnVLG9xCkfskThPa7eShdwAo

