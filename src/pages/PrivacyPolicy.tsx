import { PRIVACY_POLICY_CONTENT } from '../data/privacyPolicyContent';

const PrivacyPolicy = () => {
  const content = PRIVACY_POLICY_CONTENT;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-serif mb-2">{content.title}</h1>
          <p className="text-gray-600">Last updated: {content.lastUpdated}</p>
        </header>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>{content.intro.p1}</p>
          <p>
            {content.intro.p2BeforeLink}
            <a
              href={content.intro.generatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 hover:underline"
            >
              {content.intro.generatorLinkText}
            </a>
            {content.intro.p2AfterLink}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-gray-900">Interpretation and Definitions</h2>
            <h3 className="text-xl font-serif text-gray-900">Interpretation</h3>
            <p>{content.definitions.interpretation}</p>
            <h3 className="text-xl font-serif text-gray-900">Definitions</h3>
            <p>For the purposes of this Privacy Policy:</p>
            <ul className="list-disc pl-6 space-y-3">
              {content.definitions.items.map(item => (
                <li key={item.term}>
                  <p>
                    <strong>{item.term}</strong> {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-gray-900">
              Collecting and Using Your Personal Data
            </h2>
            <h3 className="text-xl font-serif text-gray-900">Types of Data Collected</h3>
            <h4 className="text-lg font-semibold text-gray-900">Personal Data</h4>
            <p>{content.collectingData.personalDataText}</p>
            <h4 className="text-lg font-semibold text-gray-900">Usage Data</h4>
            {content.collectingData.usageDataParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}

            <h4 className="text-lg font-semibold text-gray-900">
              Tracking Technologies and Cookies
            </h4>
            <p>{content.collectingData.trackingIntro}</p>
            <ul className="list-disc pl-6 space-y-3">
              {content.collectingData.trackingBullets.map(bullet => (
                <li key={bullet.title}>
                  <strong>{bullet.title}</strong> {bullet.text}
                </li>
              ))}
            </ul>
            <p>{content.collectingData.cookiesPersistenceText}</p>
            <p>{content.collectingData.consentText}</p>
            <p>We use both Session and Persistent Cookies for the purposes set out below:</p>
            <ul className="list-disc pl-6 space-y-3">
              {content.collectingData.cookieTypes.map(cookie => (
                <li key={cookie.title}>
                  <p>
                    <strong>{cookie.title}</strong>
                  </p>
                  <p>Type: {cookie.type}</p>
                  <p>Administered by: {cookie.administeredBy}</p>
                  <p>Purpose: {cookie.purpose}</p>
                </li>
              ))}
            </ul>
            <p>{content.collectingData.cookiesPolicyNote}</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-serif text-gray-900">Use of Your Personal Data</h3>
            <p>The Company may use Personal Data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-3">
              {content.useOfData.purposes.map(purpose => (
                <li key={purpose.label}>
                  <p>
                    <strong>{purpose.label}</strong> {purpose.text}
                  </p>
                </li>
              ))}
            </ul>
            <p>We may share Your Personal Data in the following situations:</p>
            <ul className="list-disc pl-6 space-y-3">
              {content.useOfData.sharingSituations.map(situation => (
                <li key={situation.label}>
                  <strong>{situation.label}</strong> {situation.text}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-serif text-gray-900">Retention of Your Personal Data</h3>
            <p>{content.retention.p1}</p>
            <p>{content.retention.p2}</p>
            <ul className="list-disc pl-6 space-y-3">
              {content.retention.categories.map(cat => (
                <li key={cat.title}>
                  <p>{cat.title}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    {cat.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <p>{content.retention.additionalRetentionIntro}</p>
            <ul className="list-disc pl-6 space-y-2">
              {content.retention.reasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
            <p>{content.retention.requestNote}</p>
            <p>{content.retention.deletionIntro}</p>
            <ul className="list-disc pl-6 space-y-2">
              {content.retention.deletionProcedures.map(proc => (
                <li key={proc.label}>
                  <strong>{proc.label}</strong> {proc.text}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-serif text-gray-900">Transfer of Your Personal Data</h3>
            {content.transfer.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-serif text-gray-900">Delete Your Personal Data</h3>
            {content.deleteData.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-serif text-gray-900">Disclosure of Your Personal Data</h3>
            <h4 className="text-lg font-semibold text-gray-900">Business Transactions</h4>
            <p>{content.disclosure.businessTransactions}</p>
            <h4 className="text-lg font-semibold text-gray-900">Law enforcement</h4>
            <p>{content.disclosure.lawEnforcement}</p>
            <h4 className="text-lg font-semibold text-gray-900">Other legal requirements</h4>
            <p>
              The Company may disclose Your Personal Data in the good faith belief that such action
              is necessary to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              {content.disclosure.otherLegalRequirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-serif text-gray-900">Security of Your Personal Data</h3>
            <p>{content.security}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-gray-900">Children's Privacy</h2>
            {content.childrenPrivacy.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-gray-900">Links to Other Websites</h2>
            {content.linksToOtherSites.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-gray-900">Changes to this Privacy Policy</h2>
            {content.changesToPolicy.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-gray-900">Contact Us</h2>
            <p>{content.contactUs.intro}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <p>By email: {content.contactUs.email}</p>
              </li>
              <li>
                <p>
                  By visiting this page on our website:{' '}
                  <a
                    href={content.contactUs.websiteUrl}
                    rel="external nofollow noopener"
                    target="_blank"
                    className="text-purple-700 hover:underline"
                  >
                    {content.contactUs.websiteUrl}
                  </a>
                </p>
              </li>
              <li>
                <p>By phone: {content.contactUs.phone}</p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
