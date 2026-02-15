
import React from 'react';
import { Linkedin, Mail, Phone } from 'lucide-react';
import { TEAM } from '../constants';

const Team: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">Our Leadership Team</h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">
            Meet the visionaries behind Edu Alt Tech, dedicated to transforming alternative education.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM.map((member, idx) => (
            <div key={idx} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
              <div className="relative overflow-hidden aspect-[4/5]">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <div className="flex gap-4">
                    <a href={`tel:${member.phone}`} className="p-3 bg-white rounded-full text-slate-900 hover:bg-[#90EE90] transition-colors">
                      <Phone className="w-5 h-5" />
                    </a>
                    <a href={`mailto:${member.email}`} className="p-3 bg-white rounded-full text-slate-900 hover:bg-[#90EE90] transition-colors">
                      <Mail className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-3 bg-white rounded-full text-slate-900 hover:bg-[#90EE90] transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{member.name}</h3>
                <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4">{member.role}</p>
                <div className="space-y-2 text-sm text-slate-500">
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {member.phone}
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {member.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
