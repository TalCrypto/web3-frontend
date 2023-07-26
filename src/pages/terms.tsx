import React from 'react';
import Image from 'next/image';
import PageHeader from '@/components/layout/header/PageHeader';

export default function Terms() {
  return (
    <>
      <PageHeader
        title="Terms & Conditions"
        ogTitle="Start longing or shorting NFT collections with leverage."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />
      <div className="my-[8px] flex flex-row items-center justify-start space-x-3 px-[16px] text-[36px] font-[700] lg:p-0 ">
        <Image src="/icons/favicon.svg" width={32} height={32} alt="" />
        <span>Tribe3 T&Cs</span>
      </div>
      <div className="px-[16px] pb-[16px] pt-[20px] text-[14px] text-highEmphasis lg:px-0 lg:pt-[36px]">
        <div className="space-y-6 ">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Introduction
          </div>
          <div>
            These terms and conditions (&#34;Terms&#34;) set forth the agreement between Tribe3 (&#34;we,&#34; &#34;us,&#34; or
            &#34;Company&#34;) and you (&#34;User&#34; or &#34;you&#34;) regarding your use of the Tribe3 website and services. By accessing
            and using our website at{' '}
            <a href="https://tribe3.xyz" target="_blank" rel="noreferrer" className="text-primaryBlue underline">
              https://tribe3.xyz
            </a>{' '}
            and its subdomains (&#34;Website&#34;), as well as utilizing our Services, you acknowledge that you have read, understood, and
            agree to be bound by these Terms. Please note that our protocol is currently in the Beta phase, and its purpose is for testing
            and obtaining feedback. We do not provide any representations or warranties regarding the suitability or usability of the
            protocol, Services, Website, or content. Your use of the Beta protocol is at your own risk, and we shall not be liable for any
            loss incurred.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Interpretation and Definitions
          </div>
          <div>
            In these Terms, unless otherwise specified:
            <li>&#34;Tribe3&#34; refers to the Tribe3 platform and its operators.</li>
            <li>&#34;Protocol&#34; refers to the underlying technology and algorithms governing the Tribe3 platform.</li>
            <li>
              &#34;Digital Assets&#34; refers to cryptocurrencies, tokens, and other digital assets that are legally recognized and
              supported by the Tribe3 platform.
            </li>
            <li>
              &#34;Digital Wallet&#34; refers to the digital wallet which is provided by a compatible third-party wallet, intended for the
              storage and management of your Digital Assets.
            </li>
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Modifications to These Terms
          </div>
          <div>
            Tribe3 reserves the right to modify or update these Terms at any time without prior notice. Any changes will be effective
            immediately upon posting the updated Terms on the Tribe3 platform. It is your responsibility to review these Terms regularly. By
            continuing to use the Services after any modifications, you accept and agree to the updated Terms.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Protocol
          </div>
          <div>
            The Website serves as an interface for you to interact with the Protocol, a decentralized autonomous system deployed on various
            blockchain networks. The Protocol operates through smart contracts on these networks and functions in a decentralized and
            autonomous manner. Please note that we do not control or operate the Protocol. The information provided on the Website about the
            Protocol is for informational purposes only and does not form a part of these Terms. It is important that you carefully review
            and assess the functionality and security of the Protocol and related software before using them, as their use carries inherent
            risks. We recommend conducting your own research and understanding the implications before engaging with the Protocol.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Digital Assets
          </div>
          <div>
            Our Services revolve around Digital Assets, which are digital representations of value that exist on blockchain protocols
            through smart contracts. These Digital Assets derive their ownership rights and are recorded on the blockchain. Trading or
            dealing with Digital Assets carries risks, as outlined in the &#39;Risks&#39; section. It is crucial to be aware of and
            understand these risks before engaging in any activities involving Digital Assets.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Your Digital Wallet
          </div>
          <div>
            When using the Website, you have the option to connect your digital wallet, which is facilitated through compatible third-party
            software wallets like Arbitrum or other evolving blockchain networks. It is important to note that software wallets are
            third-party services, and TRIBE3 does not endorse, control, or assume any responsibility for the security of third-party
            software wallets or liability for such wallets. You should review the applicable terms and policies governing your use of such
            software wallets. TRIBE3 does not have access to or control over your digital wallet or the Digital Assets held within it. You
            are solely responsible for the security and management of your digital wallet and any associated credentials (private key, seed
            phrase, password, etc.). At any time, you can disconnect your digital wallet from the Website.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Use of Services
          </div>
          <div>
            By using the Services, you agree to comply with all applicable laws, regulations, and these Terms. You will not use the Services
            for any illegal, unauthorized, or fraudulent activities. Tribe3 reserves the right to suspend or terminate your access to the
            Services if you violate these Terms.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Eligibility
          </div>
          <div>
            <span>
              By accessing, using, or clicking on our Website and utilizing or attempting to utilize our Services, you acknowledge, affirm
              and guarantee the following:
            </span>
            <ol style={{ listStyle: 'number', paddingLeft: '24px', marginTop: '16px' }}>
              <li>
                Whether as an individual, legal entity, or any other organization, you possess full legal capacity and authority to accept
                and be bound by these Terms.
              </li>
              <li>
                You are at least 18 years old or have reached the legal age required to form a binding contract under the applicable laws.
              </li>
              <li>
                Your use of the Services is not prohibited by the relevant laws and at all times complies with applicable laws, including
                but not limited to anti-money laundering (&#34;AML&#34;), anti-corruption, and counter-terrorist financing (&#34;CTF&#34;)
                regulations.
              </li>
              <li>
                You are not a citizen, resident, or domicile in a Restricted Country, nor are you using our Services on behalf of any person
                or entity from a Restricted Country.
              </li>
              <li>
                You have not been included in any trade embargoes or economic sanctions list, such as the list of specially designated
                nationals maintained by OFAC, or the denied persons or entity list of the U.S. Department of Commerce. Additionally, you
                have not been a subject or target of any other economic sanctions enforced by the United Nations, the European Union, or the
                United Kingdom.
              </li>
              <li>You have not been previously suspended or removed from using our Services.</li>
              <li>
                If you are acting as an employee or agent of a legal entity and agreeing to these Terms on their behalf, you confirm that
                you possess all necessary rights and authorizations to bind such legal entity.
              </li>
              <li>
                You are solely responsible for your use of the Services and, if applicable, all activities carried out on or through your
                user account.
              </li>
              <li>
                This Website and the Services are not available to residents of Afghanistan, American Samoa, Angola, Armenia, Azerbaijan,
                Belarus, Bosnia and Herzegovina, Botswana, Burundi, Cambodia, Cameroon, Canada, Central African Republic, Chad, China,
                Crimea of Ukraine, Cuba, Democratic People&#39;s Republic of Korea, Democratic Republic of the Congo, Eritrea, Ethiopia,
                Ghana, Guam, Guinea, Guinea-Bissau, Haiti, Iran, Iraq, Japan, Laos, Lebanon, Liberia, Libya, Madagascar, Mali, Mozambique,
                Myanmar, Nicaragua, Northern Mariana Islands, Pakistan, Puerto Rico, Republic of the Congo, Russia, Somalia, South Sudan,
                Sri Lanka, Sudan, Syrian Arab Republic, Tajikistan, Trinidad and Tobago, Turkmenistan, Uganda, United States, Uzbekistan,
                Vanuatu, Venezuela, Virgin Islands (U.S.), Yemen, Zimbabwe, and any other jurisdiction in which accessing or using our
                protocol is prohibited (each a &#34;Restricted Country&#34;). We reserve the right to choose markets and jurisdictions to
                conduct business and may restrict or refuse access to the Website and our Services in other countries or regions in our sole
                discretion.
              </li>
              <li>
                You are responsible for ensuring that your access to and use of the Website and Services comply with all applicable laws and
                regulations in your jurisdiction.
              </li>
            </ol>
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Restrictions
          </div>
          <div>
            Your access, use, or interaction with our Website and Services must strictly adhere to these Terms. You are expressly prohibited
            from undertaking or engaging in any dishonest or unlawful activities, fraudulent or malicious activities, or any behavior that
            violatesthese Terms. Furthermore, you must comply with all applicable laws and regulations. In addition, you must not infringe
            upon any proprietary rights, including copyrights, patents, trademarks, or trade secrets of our organization. You are also
            prohibited from transmitting any data or uploading any material that contains harmful computer code, such as viruses, Trojan
            horses, worms, or any other programs designed to disrupt or harm computer software or hardware.
            <br />
            The use of any automated devices, programs, or methods to access, copy, monitor, or bypass our Website or Services is strictly
            prohibited. This includes the use of deep linking, web crawlers, bots, spiders, or similar tools, whether automatic or manually
            operated. Backing up or making copies of the Website or any part of it, disassembling or decompiling the Website, and any
            actions that violate public interests, public morals, or the legitimate interests of others are also prohibited. Market
            manipulation activities, such as pump and dump schemes, wash trading, self-trading, front running, and spoofing or layering,
            regardless of whether prohibited by law, are strictly prohibited on our platform.
            <br /> Unauthorized access to any part of the Website or Services, including hacking or password mining, as well as any attempts
            to probe, scan, or test vulnerabilities, violate security measures, or track information of other users or visitors, are
            strictly forbidden. You must not take any actions that would impose an unreasonable or disproportionately large load on our
            infrastructure or disrupt the operation of the Website or Services. Using devices, software, or routines to interfere with
            transactions, manipulate the normal operation of the Website or Services, or engage in activities that impose an unreasonable or
            disproportionately large load on our infrastructure is prohibited. Any attempts to interfere with the proper functioning of our
            systems, including overloading, flooding, spamming, or crashing, are strictly forbidden.
            <br /> You must not use the Services for any illegal, fraudulent, or unauthorized purposes, nor engage in any activities that
            facilitate such actions. You shall not use the Services to engage in money laundering, terrorist financing, or any other illegal
            financial activities.
            <br /> If we have reasonable grounds to believe that you have violated any of these restrictions or engaged in any prohibited
            activities, we reserve the right to suspend, restrict, or terminate your access to our Website and Services, without prior
            notice and without liability. We may also take legal action, if necessary, to protect our rights and the rights of our users.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Fees and Price Estimates
          </div>
          <div>
            Tribe3 may charge fees for certain Services, including transaction fees and gas fees. Gas fees are the fees required to process
            and validate transactions on the blockchain network. The applicable fees, including gas fees, will be clearly disclosed to you
            before you confirm a transaction. Please note that gas fees are determined by the blockchain network and can vary depending on
            network congestion and other factors. You hereby agree to pay all applicable fees associated with your transactions. Price
            estimates provided by Tribe3 are for informational purposes only and are subject to market fluctuations, gas fees, and other
            factors.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Risks
          </div>
          <div>
            By utilizing the services provided by Tribe3, it is important to understand and acknowledge the inherent risks associated with
            using cryptographic systems, blockchain-based networks, and digital currencies. Tribe3 provides its services on an &#34;as
            is&#34; and &#34;as available&#34; basis without any representation or warranty. Therefore, there are no guarantees of
            continuous, uninterrupted, timely, or error-free access to the website or any part of the services.
            <br />
            Tribe3 explicitly disclaims any implied warranties of title, merchantability, fitness for a particular purpose, and
            non-infringement. The Company does not make any representations or warranties regarding the accuracy, completeness, reliability,
            currentness, or virus-free nature of the website, services, or any materials provided.
            <br />
            Furthermore, Tribe3 and its affiliates, shareholders, directors, officers, employees, attorneys, agents, representatives,
            suppliers, or contractors expressly disclaim any liability for any direct, indirect, special, incidental, intangible, or
            consequential losses or damages arising from various factors, including the performance or nonperformance of the services,
            authorized or unauthorized use of the website or services, inaccuracy or omission of data or information on the website,
            transmission errors or delays, actions or violations of these terms by third parties, or damage caused by illegal actions of
            third parties.
            <br />
            It is important to note that Tribe3 will not be liable for any loss or damage resulting from causes beyond its control. This
            provision will remain in effect even after the termination of the terms.
            <br />
            Additionally, Tribe3 does not provide any warranty regarding the merit, legality, or juridical nature of any token sold on its
            platform. Users should be aware of the risks associated with transactions involving digital currencies, which are based on
            blockchain and cryptography technologies and issued and managed in a decentralized form. The values of digital currencies can be
            highly volatile and may fluctuate significantly, posing a substantial risk of economic loss. Therefore, by using Tribe3&#39;s
            services, users acknowledge and agree to assume all risks associated with the use of the services and transactions involving
            digital currencies. Tribe3 will not be liable, directly or indirectly, for any damage or loss caused or alleged to be caused by
            or in connection with the use of or reliance on any such content, goods, or services available on or through the platform.
            <br />
            It is important for users to understand and evaluate the risks involved, possess relevant knowledge and skills, and make
            independent assessments. Users are solely responsible for securing their private keys, and losing control of these keys may
            result in permanent loss of access to digital assets. Each user is responsible for maintaining appropriate security, protection,
            and backup of their content, which may include the use of encryption technology to protect their content from unauthorized
            access and routinely archiving their content. Tribe3 will have no liability of any kind as a result of the deletion of,
            correction of, destruction of, damage to, loss of or failure to store or encrypt any content.
            <br />
            Please note that the provided risk section is a revised version based on the information given and is not an official statement.
            It is always advisable to refer to the official documentation or contact Tribe3 directly for the most accurate and up-to-date
            information regarding risks associated with their services.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Termination
          </div>
          <div>
            Tribe3 reserves the right, at its sole discretion, to terminate or suspend your access to all or any part of the Services at any
            time for any reason, with or without notice, with immediate effect. Termination of your access to and use of the Services shall
            not relieve you of any obligations arising or accruing prior to such termination or limit any liability which you otherwise may
            have to the Company or any third party.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Intellectual Property
          </div>
          <div>
            The content, design, layout, graphics, logos, trademarks, and other materials (&#34;Intellectual Property&#34;) displayed on our
            Website and Services are the property of Tribe3 or its licensors and are protected by intellectual property laws. You are
            granted a limited, non-exclusive, non-transferable, revocable license to access and use the Intellectual Property solely for the
            purpose of using the Services in accordance with these Terms.
            <br />
            You must not reproduce, modify, distribute, display, perform, publish, license, create derivative works from, transfer, or sell
            any Intellectual Property without prior written consent from Tribe3 or the respective rights holder. Unauthorized use of the
            Intellectual Property may violate copyright, trademark, and other applicable laws, and may result in legal consequences. By
            submitting any content, feedback, suggestions, or ideas to us, you grant Tribe3 a perpetual, irrevocable, worldwide,
            royalty-free, non-exclusive license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content
            for any purpose, without compensation or attribution to you. You also represent and warrant that the content does not infringe
            upon the rights of any third party and that you have the necessary rights and permissions to grant this license.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            No Professional Advice or Advertisement or Fiduciary Duties
          </div>
          <div>
            Tribe3 does not provide any professional advice or recommendations regarding investments or financial matters. It is not acting
            as an advisor in any financial, legal, tax, or other matters. The Services should not be considered as financial or legal
            advice. Tribe3 does not assume any fiduciary duties towards you.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Anti-Money Laundering
          </div>
          <div>
            Tribe3 complies with anti-money laundering and know-your-customer regulations. You may be required to provide identification and
            other information to verify your identity before using certain Services. You agree to comply with all applicable domestic and
            international laws, statutes, ordinances, and regulations regarding your use of our Website and Services.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Assignment
          </div>
          <div>
            You may not assign or transfer any rights or obligations under these Terms without the prior written consent of Tribe3. Any
            purported assignment and transfer shall be ineffective. Tribe3 may freely assign or transfer all rights and obligations under
            these Terms, fully or partially, without your consent.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Indemnification
          </div>
          <div>
            <span>
              Tribe3 requires you to indemnify and hold the company, its affiliates, directors, officers, employees, and agents harmless
              from any claims, liabilities, losses, damages, costs, or expenses (including reasonable attorneys&#39; fees) arising out of or
              related to your use of the services, your violation of any terms or agreements, or your infringement of any rights of a third
              party. In addition to the above, you agree to indemnify, defend, indemnify, and hold Tribe3 and its affiliates harmless from
              and against any claims, proceedings, actions, demands, liabilities, loss, damages, fine, penalty, interest, costs, and
              expenses, including, but not limited to, fees for attorneys and other professional advisors, arising out of or related to:
            </span>
            <ol style={{ listStyle: 'number', paddingLeft: '16px', marginTop: '16px', marginBottom: '16px' }}>
              <li>Your use or misuse of the Services or the software and any transactions conducted through the website.</li>
              <li>Any content or information you submit, post, transmit, or otherwise make available through the Services.</li>
              <li>Your violation of any terms, agreements, or policies of Tribe3.</li>
              <li>Your violation of any law, rule, regulation, or guideline.</li>
              <li>
                Your violation of any rights of a third party, including but not limited to any intellectual property, privacy or publicity,
                or confidentiality rights.
              </li>
              <li>Any negligence or misconduct on your part.</li>
            </ol>
            <span>
              Tribe3 will promptly notify you of any claim or demand for indemnification and provide you with reasonable assistance in
              defending such claims. However, Tribe3 reserves the right, at its own expense, to assume the exclusive defense and control of
              any matter subject to indemnification by you.
              <br /> Please note that the provided summary is a revised version based on the information given and is not an official
              statement. It is always advisable to refer to the official documentation or contact Tribe3 directly for the most accurate and
              up-to-date information regarding the indemnification section.
            </span>
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Jurisdiction and Governing Law
          </div>
          <div>
            These Terms are governed by and construed in accordance with the laws of the jurisdiction where Tribe3 is incorporated, without
            regard to its conflict of laws principles. Any disputes arising from these Terms will be subject to the exclusive jurisdiction
            of the courts in that jurisdiction.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Severability
          </div>
          <div>
            If any provision of these Terms is found to be unlawful, void, invalid, illegal, or for any reason unenforceable, them that
            provision shall be deemed severable from these Terms and will not affect the vailidity and enforceability of any remaining
            provisions. The remaining provisions will continue to be valid and enforceable to the fullest extent permitted by law.
          </div>
        </div>
      </div>
    </>
  );
}
