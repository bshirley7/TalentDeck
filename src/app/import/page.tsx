import { LinkedInImport } from '@/components/import/LinkedInImport';
import { EmailImport } from '@/components/import/EmailImport';
import { CsvImport } from '@/components/import/CsvImport';

export default function ImportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Import Your Contacts</h1>
        <p className="text-gray-600 mb-8">
          Get started quickly by importing your professional contacts from your existing networks.
          Choose the option that works best for you.
        </p>

        <div className="space-y-6">
          <LinkedInImport />
          <EmailImport />
          <CsvImport />
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Why import your contacts?</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Save time by importing existing contact information</li>
            <li>Get rich professional data from LinkedIn profiles</li>
            <li>Keep your professional network organized in one place</li>
            <li>Easily search and filter your contacts by skills and availability</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 