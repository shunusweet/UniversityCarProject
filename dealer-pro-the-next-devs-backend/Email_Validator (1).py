import pandas as pd
import asyncio
import glob
import os
from validate_email_address import validate_email
from urllib.parse import urlparse
import math
# --- Email Combinations ---
def generate_email_combinations(first, last, domain):
    first = first.lower()
    last = last.lower()
    return [
        f"{first}{last}@{domain}",
        f"{first[0]}{last}@{domain}",
        f"{first}{last[0]}@{domain}",
    ]


# --- Name Splitter ---
def split_name(full_name):
    parts = full_name.strip().split()
    if len(parts) >= 2:
        return parts[0], parts[-1]
    return parts[0], ""


async def extract_domain_from_url(website):
    try:
        # Ensure the website has a scheme
        if not website.startswith(("http://", "https://")):
            website = "https://" + website
        
        parsed = urlparse(website)
        domain = parsed.netloc or parsed.path  # fallback if malformed
        domain = domain.replace("www.", "")  # remove www if present
        return domain.strip("/")
    except Exception:
        return ""
# --- Async SMTP Validation Wrapper ---
async def async_validate_email(email, timeout=10):
    try:
        return await asyncio.wait_for(
            asyncio.to_thread(validate_email, email, verify=True),
            timeout=timeout
        )
    except asyncio.TimeoutError:
        print(f"⏱️ Timeout: {email}")
        return False
    except Exception as e:
        print(f"❌ Error: {email} → {e}")
        return False

# --- Async Row Processor ---
async def process_row(row):
    company_id = row["company_id"]
    website = row["website"]
    full_name = row["person_name"]

    domain = await extract_domain_from_url(website)
    first, last = split_name(full_name)
    emails = generate_email_combinations(first, last, domain)

    statuses = await asyncio.gather(*[
        async_validate_email(email) for email in emails
    ])

    return {
        "company_id": company_id,
        "person_name": full_name,
        "website": website,
        "email_1": emails[0],
        "status_1": "Valid" if statuses[0] else "Invalid",
        "email_2": emails[1],
        "status_2": "Valid" if statuses[1] else "Invalid",
        "email_3": emails[2],
        "status_3": "Valid" if statuses[2] else "Invalid",
    }

def chunk_list(lst, chunk_size):
    for i in range(0, len(lst), chunk_size):
        yield lst[i:i + chunk_size]
# --- Async CSV Processor for One File ---
async def process_csv_file(input_file, batch_size=10):
    df = pd.read_csv(input_file)
    results = []

    chunks = chunk_list(list(df.iterrows()), batch_size)

    for chunk_index, chunk in enumerate(chunks):
        tasks = [process_row(row[1]) for row in chunk]
        batch_results = await asyncio.gather(*tasks)
        results.extend(batch_results)
        print(f"✅ Processed batch {chunk_index + 1} ({len(results)} total rows)")

    output_df = pd.DataFrame(results)
    base_name = os.path.splitext(input_file)[0]
    output_file = f"{base_name}_validated.csv"
    output_df.to_csv(output_file, index=False)
    print(f"✅ Completed: {input_file} → {output_file}")

# --- Main Async Runner ---
async def process_all_csv_files():
    csv_files = glob.glob("*.csv")
    if not csv_files:
        print("⚠️ No CSV files found in this directory.")
        return

    for file in csv_files:
        if "validated" in file:
            continue  # skip already validated ones
        await process_csv_file(file)


# --- Run Entry Point ---
if __name__ == "__main__":
    asyncio.run(process_all_csv_files())
