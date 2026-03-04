const fs = require('fs');
const path = require('path');

const base = path.resolve('c:/Users/Kishan B M/Documents/accrefin-web/accrefin/src/screens/LoanProducts');

function buildCalcSection(title, subtitle, loanMin, loanMax, loanStep, loanMinLabel, loanMaxLabel, tenureMin, tenureMax, ratMin, ratMax, ratStep, ratMinLabel, ratMaxLabel) {
  return [
    '      <section id="calculator" className="py-20 bg-[#0E396E] relative overflow-hidden">',
    '        <div className="container mx-auto max-w-7xl px-4 relative z-10">',
    '          <div className="text-center mb-16">',
    '            <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>',
    '              ' + title,
    '            </h2>',
    '            <p className={`text-lg text-white/70 font-medium ${bodyFont}`}>',
    '              ' + subtitle,
    '            </p>',
    '          </div>',
    '          <Card className="max-w-5xl mx-auto shadow-lg border-0 bg-white">',
    '            <CardContent className="p-10 lg:p-12">',
    '              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">',
    '                <div>',
    '                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Loan Amount</label>',
    '                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">',
    '                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>\u20B9{(loanAmount/100000).toFixed(1)}L</span>',
    '                  </div>',
    '                  <input type="range" min="' + loanMin + '" max="' + loanMax + '" step="' + loanStep + '" value={loanAmount}',
    '                    onChange={(e) => setLoanAmount(Number(e.target.value))}',
    '                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"',
    '                    style={{ \'--fill-percent\': getFillPercentage(loanAmount, ' + loanMin + ', ' + loanMax + ') } as React.CSSProperties}',
    '                  />',
    '                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>',
    '                    <span>' + loanMinLabel + '</span><span>' + loanMaxLabel + '</span>',
    '                  </div>',
    '                </div>',
    '                <div>',
    '                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Tenure</label>',
    '                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">',
    '                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>{tenure} Months</span>',
    '                  </div>',
    '                  <input type="range" min="' + tenureMin + '" max="' + tenureMax + '" value={tenure}',
    '                    onChange={(e) => setTenure(Number(e.target.value))}',
    '                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"',
    '                    style={{ \'--fill-percent\': getFillPercentage(tenure, ' + tenureMin + ', ' + tenureMax + ') } as React.CSSProperties}',
    '                  />',
    '                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>',
    '                    <span>' + tenureMin + '</span><span>' + tenureMax + '</span>',
    '                  </div>',
    '                </div>',
    '                <div>',
    '                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Interest Rate</label>',
    '                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">',
    '                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>{interestRate}%</span>',
    '                  </div>',
    '                  <input type="range" min="' + ratMin + '" max="' + ratMax + '" step="' + ratStep + '" value={interestRate}',
    '                    onChange={(e) => setInterestRate(Number(e.target.value))}',
    '                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"',
    '                    style={{ \'--fill-percent\': getFillPercentage(interestRate, ' + ratMin + ', ' + ratMax + ') } as React.CSSProperties}',
    '                  />',
    '                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>',
    '                    <span>' + ratMinLabel + '</span><span>' + ratMaxLabel + '</span>',
    '                  </div>',
    '                </div>',
    '              </div>',
    '              <Separator className="my-6" />',
    '              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">',
    '                <div className="space-y-3">',
    '                  <div className="flex justify-between items-center py-3 border-b border-gray-100">',
    '                    <span className={`text-gray-600 text-sm font-medium ${bodyFont}`}>Principal Amount</span>',
    '                    <span className={`font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded text-sm ${bodyFont}`}>\u20B9{loanAmount.toLocaleString()}</span>',
    '                  </div>',
    '                  <div className="flex justify-between items-center py-3 border-b border-gray-100">',
    '                    <span className={`text-gray-600 text-sm font-medium ${bodyFont}`}>Total Interest</span>',
    '                    <span className={`font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded text-sm ${bodyFont}`}>\u20B9{totalInterest.toLocaleString()}</span>',
    '                  </div>',
    '                  <div className="flex justify-between items-center py-3 border-b-2 border-[#0050B2]">',
    '                    <span className={`text-[#0050B2] font-semibold text-sm ${bodyFont}`}>Total Payable</span>',
    '                    <span className={`font-bold text-[#0050B2] bg-blue-50 px-3 py-1 rounded text-sm ${bodyFont}`}>\u20B9{totalAmount.toLocaleString()}</span>',
    '                  </div>',
    '                </div>',
    '                <div className="bg-[#0877ff] rounded-2xl p-8 text-white text-center flex flex-col items-center justify-center">',
    '                  <h3 className={`text-base font-semibold mb-1 opacity-90 ${bodyFont}`}>Monthly EMI</h3>',
    '                  <div className={`text-4xl font-extrabold mb-6 ${bodyFont}`}>\u20B9{emi.toLocaleString()}</div>',
    '                  <Button onClick={scrollToForm} className={`bg-white text-[#0877ff] hover:bg-gray-100 font-bold px-8 py-2.5 rounded text-sm transition-all duration-300 shadow-[0px_4px_11.8px_-5px_#0050b2] ${bodyFont}`}>',
    '                    APPLY NOW',
    '                  </Button>',
    '                </div>',
    '              </div>',
    '            </CardContent>',
    '          </Card>',
    '        </div>',
    '      </section>',
  ].join('\n');
}

function buildFaqSection(subtitle) {
  return [
    '      <section id="faqs" className="py-16 bg-[#0e396d] relative overflow-hidden">',
    '        <div className="absolute inset-0 pointer-events-none overflow-hidden">',
    '          <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">',
    '            {Array.from({ length: 22 }).map((_, i) => {',
    '              const y = 30 + i * 42;',
    '              const perspectiveOffset = (i - 11) * 5;',
    '              return (<line key={`fh-${i}`} x1={-40 + perspectiveOffset} y1={y} x2={1480 - perspectiveOffset} y2={y} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />);',
    '            })}',
    '            {Array.from({ length: 26 }).map((_, i) => {',
    '              const x = -40 + i * 60;',
    '              const topOffset = (i - 13) * 6;',
    '              return (<line key={`fv-${i}`} x1={x + topOffset} y1={0} x2={x - topOffset} y2={900} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />);',
    '            })}',
    '            <line x1="0" y1="0" x2="720" y2="450" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" />',
    '            <line x1="1440" y1="0" x2="720" y2="450" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" />',
    '            <line x1="0" y1="900" x2="720" y2="450" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" />',
    '            <line x1="1440" y1="900" x2="720" y2="450" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" />',
    '            <line x1="360" y1="0" x2="720" y2="450" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />',
    '            <line x1="1080" y1="0" x2="720" y2="450" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />',
    '            <line x1="360" y1="900" x2="720" y2="450" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />',
    '            <line x1="1080" y1="900" x2="720" y2="450" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />',
    '          </svg>',
    '        </div>',
    '        <div className="container mx-auto max-w-7xl px-4 relative z-10">',
    '          <div className="text-center mb-12">',
    '            <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>',
    '              Frequently Asked<br />Questions',
    '            </h2>',
    '            <p className={`text-lg text-white/60 font-medium ${bodyFont}`}>',
    '              ' + subtitle,
    '            </p>',
    '          </div>',
    '          <div className="max-w-4xl mx-auto space-y-3">',
    '            {faqs.map((faq, index) => (',
    '              <Card key={index} className="border-0 bg-white hover:shadow-lg transition-shadow duration-300">',
    '                <CardContent className="p-0">',
    '                  <button',
    '                    onClick={() => setExpandedDoc(expandedDoc === `faq-${index}` ? null : `faq-${index}`)}',
    '                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-lg"',
    '                  >',
    '                    <h3 className={`text-sm font-semibold text-gray-900 pr-4 ${bodyFont}`}>{faq.question}</h3>',
    '                    {expandedDoc === `faq-${index}` ? (',
    '                      <ChevronUpIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />',
    '                    ) : (',
    '                      <ChevronDownIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />',
    '                    )}',
    '                  </button>',
    '                  {expandedDoc === `faq-${index}` && (',
    '                    <div className="px-6 pb-5 border-t border-gray-100">',
    '                      <p className={`text-gray-600 leading-relaxed mt-4 text-sm ${bodyFont}`}>{faq.answer}</p>',
    '                    </div>',
    '                  )}',
    '                </CardContent>',
    '              </Card>',
    '            ))}',
    '          </div>',
    '        </div>',
    '      </section>',
  ].join('\n');
}

function replaceSectionInFile(filePath, oldSectionStart, newSection) {
  let content = fs.readFileSync(filePath, 'utf8');
  const startIdx = content.indexOf(oldSectionStart);
  if (startIdx === -1) {
    console.log('  NOT FOUND: ' + oldSectionStart.substring(0,60) + ' in ' + path.basename(filePath));
    return false;
  }
  const searchFrom = startIdx + oldSectionStart.length;
  const endTag = '</section>';
  const endIdx = content.indexOf(endTag, searchFrom) + endTag.length;
  if (endIdx < endTag.length) {
    console.log('  WARNING: Section end not found');
    return false;
  }
  const before = content.substring(0, startIdx);
  const after = content.substring(endIdx);
  fs.writeFileSync(filePath, before + newSection + after, 'utf8');
  console.log('  OK: Replaced in ' + path.basename(filePath));
  return true;
}

const OLD_CALC_START = '<section id="calculator" className="py-16 bg-[#0E396E]">';
const OLD_FAQ_START = '<section id="faqs" className="py-16 bg-[#0E396E]">';

console.log('=== Calculator Sections ===');

console.log('Car:');
replaceSectionInFile(path.join(base, 'CarLoanPage/CarLoanPage.tsx'), OLD_CALC_START,
  buildCalcSection('Car Loan EMI Calculator','Calculate your monthly EMI and plan your car purchase',
    100000,10000000,50000,'\u20B91L','\u20B91Cr',12,84,7.5,18,0.1,'7.5%','18%'));

console.log('Education:');
replaceSectionInFile(path.join(base, 'EducationLoanPage/EducationLoanPage.tsx'), OLD_CALC_START,
  buildCalcSection('Education Loan EMI Calculator','Calculate your monthly EMI and plan your education financing',
    100000,15000000,100000,'\u20B91L','\u20B91.5Cr',12,180,8.5,16,0.1,'8.5%','16%'));

console.log('Home:');
replaceSectionInFile(path.join(base, 'HomeLoanPage/HomeLoanPage.tsx'), OLD_CALC_START,
  buildCalcSection('Home Loan EMI Calculator','Calculate your monthly EMI and plan your home purchase',
    100000,50000000,100000,'\u20B91L','\u20B95Cr',60,360,6.5,15,0.1,'6.5%','15%'));

console.log('Machinery:');
replaceSectionInFile(path.join(base, 'MachineryLoanPage/MachineryLoanPage.tsx'), OLD_CALC_START,
  buildCalcSection('Machinery Loan EMI Calculator','Calculate your monthly EMI and plan your machinery finances',
    100000,20000000,100000,'\u20B91L','\u20B92Cr',12,84,10,22,0.1,'10%','22%'));

console.log('\n=== FAQ Sections ===');
const faqList = [
  ['BusinessLoanPage/BusinessLoanPage.tsx', 'Get answers to common questions about business loans'],
  ['CarLoanPage/CarLoanPage.tsx', 'Get answers to common questions about car loans'],
  ['EducationLoanPage/EducationLoanPage.tsx', 'Get answers to common questions about education loans'],
  ['HomeLoanPage/HomeLoanPage.tsx', 'Get answers to common questions about home loans'],
  ['MachineryLoanPage/MachineryLoanPage.tsx', 'Get answers to common questions about machinery loans'],
];
for (const [relPath, subtitle] of faqList) {
  console.log(path.basename(relPath).replace('.tsx','') + ':');
  replaceSectionInFile(path.join(base, relPath), OLD_FAQ_START, buildFaqSection(subtitle));
}

console.log('\nAll done!');
